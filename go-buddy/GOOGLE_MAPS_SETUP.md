# Google Maps Setup Instructions for iOS

## Problem
The Google Maps view shows a blank screen with the error: "AirGoogleMaps dir must be added to your xCode project to support GoogleMaps on iOS."

## Solution
The issue has been fixed by updating the Podfile to automatically include the AirGoogleMaps source files during pod installation. Additionally, you need to provide a valid Google Maps API key.

## Setup Steps

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Enable the **Maps SDK for iOS**:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps SDK for iOS"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - (Optional but recommended) Restrict the API key:
     - Application restrictions: iOS apps
     - Bundle identifier: `kehan.jin.gobuddy`
     - API restrictions: Select "Maps SDK for iOS"

### 2. Configure the API Key

Create a `.env` file in the `go-buddy` directory with the following content:

```bash
# Google Maps API Key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE

# Google OAuth Client IDs (already configured)
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=353229046135-c1cq6bijclsnk1tdsjf520od87idhgma.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
```

**Important:** Replace `YOUR_ACTUAL_API_KEY_HERE` with your actual API key from step 1.

### 3. Rebuild the App

```bash
cd go-buddy
npx expo run:ios
```

## What Was Changed

### 1. Podfile Updates
- Added `Google-Maps-iOS-Utils` pod dependency
- Added post-install hook that automatically:
  - Finds the `react-native-maps` target
  - Adds all AirGoogleMaps source files (`.h`, `.m`, `.mm`) to the build
  - Links GoogleMaps and Google-Maps-iOS-Utils frameworks

### 2. Environment Configuration
- The app now reads `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` from environment variables
- This key is injected into Info.plist at build time
- AppDelegate.swift initializes Google Maps SDK with this key

## Verification

After rebuilding, the MapScreen should display:
- ✅ Google Maps tiles
- ✅ User location (if permissions granted)
- ✅ Activity markers on the map
- ✅ Map controls (zoom, pan, etc.)

## Troubleshooting

### Map still shows blank
1. **Check API Key**: Ensure the API key is valid and has "Maps SDK for iOS" enabled
2. **Check Console**: Look for Google Maps initialization errors in Xcode console
3. **Check Restrictions**: If using restricted API key, verify the bundle ID matches `kehan.jin.gobuddy`

### Build errors
1. Run `cd ios && pod deintegrate && pod install` to clean and reinstall pods
2. Clean build folder in Xcode: Product > Clean Build Folder
3. Rebuild: `npx expo run:ios`

### API Key not loading
1. Verify `.env` file is in the `go-buddy` directory (not `go-buddy/ios`)
2. Check that the key starts with `EXPO_PUBLIC_`
3. Restart the build process to pick up environment changes

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/ios-sdk)
- [react-native-maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

