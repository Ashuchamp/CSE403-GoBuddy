import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker, Region, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {Ionicons} from '@expo/vector-icons';
import {colors, spacing, typography} from '../theme';

export type SelectedLocation = {
  latitude: number;
  longitude: number;
  name?: string;
};

type LocationPickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: SelectedLocation) => void;
  initialLocation?: SelectedLocation;
};

// UW Seattle campus center coordinates
const UW_CENTER: Region = {
  latitude: 47.6553,
  longitude: -122.3035,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type SearchResult = {
  name: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
  distance?: number; // Distance in kilometers from user location
};

export function LocationPicker({visible, onClose, onSelect, initialLocation}: LocationPickerProps) {
  const [initialRegion, setInitialRegion] = useState<Region>(() => {
    // Set initial region based on initialLocation or default to UW center
    if (initialLocation) {
      return {
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return UW_CENTER;
  });
  const mapRef = React.useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(
    initialLocation || null,
  );
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      // Set initial region based on initialLocation
      if (initialLocation) {
        setSelectedLocation(initialLocation);
        setInitialRegion({
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        setInitialRegion(UW_CENTER);
      }
      // Request location permission after a short delay to avoid immediate map movement
      setTimeout(() => {
        requestLocationPermission();
      }, 100);
    } else {
      // Reset when closing
      setSearchQuery('');
      setSearchResults([]);
      setSelectedLocation(initialLocation || null);
    }
  }, [visible, initialLocation]);

  // Search for locations using Google Places API
  const searchLocations = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        // Get Google Maps API Key from environment
        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          // Fallback to expo-location if no API key
          console.warn('Google Maps API Key not found, using fallback geocoding');
          const results = await Location.geocodeAsync(query.trim());
          const formattedResults: SearchResult[] = results.map((result: any) => ({
            name: result.name || result.street || query,
            latitude: result.latitude,
            longitude: result.longitude,
            formattedAddress:
              [result.street, result.city, result.region, result.country]
                .filter(Boolean)
                .join(', ') || query,
          }));
          setSearchResults(formattedResults);
          return;
        }

        // Build Google Places Autocomplete API URL
        const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
        const params = new URLSearchParams({
          input: query.trim(),
          key: apiKey,
          types: 'establishment|geocode', // Include both places and addresses
          language: 'en',
        });

        // Add location bias if user location is available
        if (userLocation) {
          params.append('location', `${userLocation.latitude},${userLocation.longitude}`);
          params.append('radius', '50000'); // 50km radius for local results
        } else {
          // Bias towards Seattle/UW area
          params.append('location', `${UW_CENTER.latitude},${UW_CENTER.longitude}`);
          params.append('radius', '50000');
        }

        const response = await fetch(`${baseUrl}?${params.toString()}`);
        const data = await response.json();

        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
          console.error('Google Places API error:', data.status, data.error_message);
          // Fallback to expo-location
          const results = await Location.geocodeAsync(query.trim());
          const formattedResults: SearchResult[] = results.map((result: any) => ({
            name: result.name || result.street || query,
            latitude: result.latitude,
            longitude: result.longitude,
            formattedAddress:
              [result.street, result.city, result.region, result.country]
                .filter(Boolean)
                .join(', ') || query,
          }));
          setSearchResults(formattedResults);
          return;
        }

        if (data.status === 'ZERO_RESULTS' || !data.predictions || data.predictions.length === 0) {
          setSearchResults([]);
          return;
        }

        // Get place details for each prediction to get coordinates
        const placeDetailsPromises = data.predictions.slice(0, 10).map(async (prediction: any) => {
          try {
            const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
            const detailsParams = new URLSearchParams({
              place_id: prediction.place_id,
              key: apiKey,
              fields: 'geometry,formatted_address,name',
            });

            const detailsResponse = await fetch(`${detailsUrl}?${detailsParams.toString()}`);
            const detailsData = await detailsResponse.json();

            if (detailsData.status === 'OK' && detailsData.result) {
              const place = detailsData.result;
              const location = place.geometry?.location;

              if (location) {
                let distance: number | undefined;
                if (userLocation) {
                  distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    location.lat,
                    location.lng,
                  );
                }

                return {
                  name: place.name || prediction.description,
                  latitude: location.lat,
                  longitude: location.lng,
                  formattedAddress: place.formatted_address || prediction.description,
                  distance: distance,
                };
              }
            }
          } catch (error) {
            console.error('Error fetching place details:', error);
          }
          return null;
        });

        const placeDetails = await Promise.all(placeDetailsPromises);
        const validResults = placeDetails.filter(
          (result): result is SearchResult => result !== null,
        );

        // Sort by distance if available
        validResults.sort((a, b) => {
          if (a.distance !== undefined && b.distance !== undefined) {
            return a.distance - b.distance;
          }
          return 0;
        });

        setSearchResults(validResults);
      } catch (error) {
        console.error('Error searching locations:', error);
        // Fallback to expo-location
        try {
          const results = await Location.geocodeAsync(query.trim());
          const formattedResults: SearchResult[] = results.map((result: any) => ({
            name: result.name || result.street || query,
            latitude: result.latitude,
            longitude: result.longitude,
            formattedAddress:
              [result.street, result.city, result.region, result.country]
                .filter(Boolean)
                .join(', ') || query,
          }));
          setSearchResults(formattedResults);
        } catch (fallbackError) {
          console.error('Fallback geocoding also failed:', fallbackError);
          setSearchResults([]);
          Alert.alert('Error', 'Failed to search locations. Please try again.');
        }
      } finally {
        setSearching(false);
      }
    },
    [userLocation],
  );

  // Debounced search with shorter delay for better responsiveness
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchLocations(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 400); // Slightly longer delay for Google Places API

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchLocations]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const requestLocationPermission = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);
        // Only animate to user location if no initial location was set
        // This prevents map from jumping when user already has a location selected
        if (!initialLocation && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              ...coords,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            500,
          );
        }
      } else {
        setLocationPermission(false);
        // Use UW center as default if permission denied
        setUserLocation({
          latitude: UW_CENTER.latitude,
          longitude: UW_CENTER.longitude,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermission(false);
      setUserLocation({
        latitude: UW_CENTER.latitude,
        longitude: UW_CENTER.longitude,
      });
    }
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    const location: SelectedLocation = {
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.formattedAddress || result.name,
    };
    setSelectedLocation(location);
    // Animate map to selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    }
    setSearchQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const handleConfirm = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please search and select a location');
      return;
    }

    setLoading(true);
    try {
      // If location already has a name from search, use it directly
      if (selectedLocation.name) {
        onSelect(selectedLocation);
      } else {
        // Otherwise, reverse geocode to get location name
        const addresses = await Location.reverseGeocodeAsync({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });

        if (addresses.length > 0) {
          const address = addresses[0];
          const locationName =
            address.street && address.name
              ? `${address.name}, ${address.street}`
              : address.formattedAddress || 'Selected Location';

          onSelect({
            ...selectedLocation,
            name: locationName,
          });
        } else {
          onSelect({
            ...selectedLocation,
            name:
              `Location (${selectedLocation.latitude.toFixed(4)}, ` +
              `${selectedLocation.longitude.toFixed(4)})`,
          });
        }
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      onSelect({
        ...selectedLocation,
        name:
          selectedLocation.name ||
          `Location (${selectedLocation.latitude.toFixed(4)}, ` +
            `${selectedLocation.longitude.toFixed(4)})`,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedLocation(initialLocation || null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}
            disabled={!selectedLocation || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name={searching ? 'hourglass-outline' : 'search-outline'}
            size={20}
            color={searching ? colors.primary : colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location (e.g., Suzzallo Library, IMA)"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              // Show searching state immediately when user types
              if (text.trim() && !searching) {
                setSearching(true);
              }
            }}
            autoCapitalize="words"
            returnKeyType="search"
            onSubmitEditing={(e) => {
              e.preventDefault();
              Keyboard.dismiss();
              if (searchQuery.trim()) {
                // Force immediate search on Enter
                searchLocations(searchQuery);
              }
            }}
            blurOnSubmit={false}
          />
          {searching && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.searchLoader} />
          )}
          {searchQuery.length > 0 && !searching && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
                Keyboard.dismiss();
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.searchResultsContainer}>
            {searching ? (
              <View style={styles.searchEmptyState}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.searchEmptyText}>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => `${item.latitude}-${item.longitude}-${index}`}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() => handleSelectSearchResult(item)}
                  >
                    <Ionicons name="location" size={20} color={colors.primary} />
                    <View style={styles.searchResultText}>
                      <Text style={styles.searchResultName}>{item.name}</Text>
                      {item.formattedAddress && item.formattedAddress !== item.name && (
                        <Text style={styles.searchResultAddress}>{item.formattedAddress}</Text>
                      )}
                      {item.distance !== undefined && item.distance < 50 && (
                        <Text style={styles.searchResultDistance}>
                          {item.distance < 1
                            ? `${Math.round(item.distance * 1000)}m away`
                            : `${item.distance.toFixed(1)}km away`}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
                style={styles.searchResultsList}
              />
            ) : (
              <View style={styles.searchEmptyState}>
                <Ionicons name="search-outline" size={24} color={colors.textMuted} />
                <Text style={styles.searchEmptyText}>No results found</Text>
                <Text style={styles.searchEmptySubtext}>Try a different search term</Text>
              </View>
            )}
          </View>
        )}

        {/* Map */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={locationPermission === true}
          showsMyLocationButton={false}
          scrollEnabled={true}
          zoomEnabled={true}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title={selectedLocation.name || 'Activity Location'}
              pinColor={colors.primary}
            />
          )}
        </MapView>

        {/* Selected location info */}
        {selectedLocation && (
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.locationName} numberOfLines={2}>
              {selectedLocation.name || 'Selected Location'}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: Platform.OS === 'ios' ? spacing.sm : spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 56,
  },
  cancelButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  confirmButton: {
    padding: spacing.xs,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  searchLoader: {
    marginLeft: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
  },
  searchResultsContainer: {
    maxHeight: 200,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchResultsList: {
    flexGrow: 0,
  },
  searchEmptyState: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  searchEmptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  searchEmptySubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  searchResultText: {
    flex: 1,
  },
  searchResultName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs / 2,
  },
  searchResultAddress: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  searchResultDistance: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.xs / 2,
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  locationName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
});
