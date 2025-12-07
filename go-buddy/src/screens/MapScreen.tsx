import React, {useState, useEffect, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import MapView, {Marker, Region, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {Ionicons} from '@expo/vector-icons';
import {User, ActivityIntent, ActivityRequest} from '../types';
import {ActivityDetailModal} from '../components/ActivityDetailModal';
import {colors, spacing, typography} from '../theme';

type MapScreenProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  activityRequests?: ActivityRequest[];
  onJoinActivity?: (intentId: string) => void;
};

// UW Seattle campus center coordinates
const UW_CENTER: Region = {
  latitude: 47.6553,
  longitude: -122.3035,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  return R * c;
}

export function MapScreen({
  currentUser,
  activityIntents,
  activityRequests = [],
  onJoinActivity,
}: MapScreenProps) {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>(UW_CENTER);
  const [selectedActivity, setSelectedActivity] = useState<ActivityIntent | null>(null);
  const [filterRadius, setFilterRadius] = useState<number | 'all'>(5); // km or 'all' to show all
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [geocodedActivities, setGeocodedActivities] = useState<
    Map<string, {latitude: number; longitude: number}>
  >(new Map());
  const geocodingInProgress = useRef<Set<string>>(new Set());

  // Request location permission and get user location
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Geocode activities without coordinates
  useEffect(() => {
    const geocodeActivities = async () => {
      const activitiesToGeocode = activityIntents.filter(
        (activity) =>
          activity.status === 'active' &&
          !activity.latitude &&
          !activity.longitude &&
          (activity.campusLocation || activity.locationName) &&
          !geocodedActivities.has(activity.id) &&
          !geocodingInProgress.current.has(activity.id),
      );

      if (activitiesToGeocode.length === 0) return;

      console.log(`Geocoding ${activitiesToGeocode.length} activities without coordinates...`);

      for (const activity of activitiesToGeocode) {
        geocodingInProgress.current.add(activity.id);
        try {
          const locationName = activity.locationName || activity.campusLocation;
          if (!locationName) {
            geocodingInProgress.current.delete(activity.id);
            continue;
          }

          const results = await Location.geocodeAsync(locationName);
          if (results && results.length > 0) {
            const {latitude, longitude} = results[0];
            setGeocodedActivities((prev) => {
              const newMap = new Map(prev);
              newMap.set(activity.id, {latitude, longitude});
              return newMap;
            });
            console.log(`Geocoded "${activity.title}": ${latitude}, ${longitude}`);
          }
        } catch (error) {
          console.error(`Failed to geocode activity "${activity.title}":`, error);
        } finally {
          geocodingInProgress.current.delete(activity.id);
        }
      }
    };

    geocodeActivities();
  }, [activityIntents, geocodedActivities]);

  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);
        setRegion({
          ...coords,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } else {
        setLocationPermission(false);
        // Use UW center as default
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
    } finally {
      setLoading(false);
    }
  };

  // Filter activities that have coordinates (including geocoded ones)
  const nearbyActivities = useMemo(() => {
    // Debug: Log all activities to see what we're working with
    const activeActivities = activityIntents.filter((activity) => activity.status === 'active');
    const activitiesWithCoords = activeActivities
      .map((activity) => {
        // If activity has coordinates, use them
        if (activity.latitude && activity.longitude) {
          return activity;
        }
        // Otherwise, check if we've geocoded it
        const geocoded = geocodedActivities.get(activity.id);
        if (geocoded) {
          return {
            ...activity,
            latitude: geocoded.latitude,
            longitude: geocoded.longitude,
          };
        }
        return null;
      })
      .filter((activity): activity is ActivityIntent => activity !== null);

    console.log(
      `MapScreen: ${activeActivities.length} active activities, ` +
        `${activitiesWithCoords.length} with coordinates`,
    );

    // If showing all, return all activities with coordinates
    if (filterRadius === 'all') {
      if (userLocation) {
        return activitiesWithCoords
          .map((activity) => {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              activity.latitude!,
              activity.longitude!,
            );
            return {...activity, distance};
          })
          .sort((a, b) => a.distance - b.distance);
      }
      // If no user location, show all activities with coordinates
      return activitiesWithCoords.map((activity) => ({
        ...activity,
        distance: 0, // No distance calculation needed
      }));
    }

    // If user location is available, filter by distance and sort
    if (userLocation) {
      return activitiesWithCoords
        .map((activity) => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            activity.latitude!,
            activity.longitude!,
          );
          return {...activity, distance};
        })
        .filter((activity) => activity.distance <= filterRadius)
        .sort((a, b) => a.distance - b.distance);
    }

    // If no user location, show all activities with coordinates (centered around UW)
    return activitiesWithCoords.map((activity) => {
      // Calculate distance from UW center as fallback
      const distance = calculateDistance(
        UW_CENTER.latitude,
        UW_CENTER.longitude,
        activity.latitude!,
        activity.longitude!,
      );
      return {...activity, distance};
    });
  }, [activityIntents, userLocation, filterRadius]);

  // User's participating requests
  const myRequestsByActivity = useMemo(() => {
    const map = new Map<string, ActivityRequest>();
    activityRequests
      .filter((r) => r.userId === currentUser.id)
      .forEach((r) => {
        map.set(r.activityId, r);
      });
    return map;
  }, [activityRequests, currentUser.id]);

  const getMarkerColor = (activity: ActivityIntent): string => {
    const req = myRequestsByActivity.get(activity.id);
    if (req?.status === 'approved') return '#4CAF50'; // Green: joined
    if (req?.status === 'pending') return '#FFC107'; // Yellow: pending
    if (activity.currentPeople >= activity.maxPeople) return '#9E9E9E'; // Gray: full
    return colors.primary; // Blue: available
  };

  const handleMarkerPress = (activity: ActivityIntent) => {
    setSelectedActivity(activity);
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      setRegion({
        ...userLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } else {
      requestLocationPermission();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={locationPermission === true}
        showsMyLocationButton={false}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location" pinColor="#2196F3">
            <Ionicons name="person-circle" size={32} color="#2196F3" />
          </Marker>
        )}

        {/* Activity markers */}
        {nearbyActivities.map((activity) => (
          <Marker
            key={activity.id}
            coordinate={{
              latitude: activity.latitude!,
              longitude: activity.longitude!,
            }}
            title={activity.title}
            description={activity.locationName || activity.campusLocation || 'Activity Location'}
            pinColor={getMarkerColor(activity)}
            onPress={() => handleMarkerPress(activity)}
          />
        ))}
      </MapView>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Filter radius selector */}
        <View style={styles.radiusSelector}>
          <Text style={styles.radiusLabel}>Radius:</Text>
          {[1, 3, 5, 10, 'all'].map((radius) => (
            <TouchableOpacity
              key={radius}
              style={[styles.radiusButton, filterRadius === radius && styles.radiusButtonActive]}
              onPress={() => setFilterRadius(radius as number | 'all')}
            >
              <Text
                style={[
                  styles.radiusButtonText,
                  filterRadius === radius && styles.radiusButtonTextActive,
                ]}
              >
                {radius === 'all' ? 'All' : `${radius}km`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Center on user button */}
        <TouchableOpacity style={styles.centerButton} onPress={handleCenterOnUser}>
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Info bar */}
      <View style={styles.infoBar}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>
          {nearbyActivities.length} {nearbyActivities.length === 1 ? 'activity' : 'activities'}
          {filterRadius === 'all'
            ? ' (all locations)'
            : userLocation
              ? ` within ${filterRadius}km`
              : ' (with location)'}
        </Text>
      </View>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        visible={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
        currentUserId={currentUser.id}
        onJoinActivity={onJoinActivity}
        activityRequests={activityRequests}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  radiusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  radiusLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  radiusButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
  radiusButtonActive: {
    backgroundColor: colors.primary,
  },
  radiusButtonText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  radiusButtonTextActive: {
    color: '#fff',
  },
  centerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoBar: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
});
