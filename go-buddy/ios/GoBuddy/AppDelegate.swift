import Expo
import React
import ReactAppDependencyProvider
import GoogleMaps

@UIApplicationMain
public class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Initialize Google Maps SDK - must be called before any map views are created
    var apiKey: String? = nil
    
    // First, try to get from Info.plist
    if let plistKey = Bundle.main.object(forInfoDictionaryKey: "GMSApiKey") as? String,
       !plistKey.isEmpty,
       plistKey != "${EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}" {
      apiKey = plistKey
    }
    
    // If not found in Info.plist, try environment variable (for development)
    if apiKey == nil || apiKey?.isEmpty == true {
      apiKey = ProcessInfo.processInfo.environment["EXPO_PUBLIC_GOOGLE_MAPS_API_KEY"]
    }
    
    // Initialize Google Maps with the API key
    if let key = apiKey, !key.isEmpty {
      GMSServices.provideAPIKey(key)
      print("✅ Google Maps SDK initialized successfully")
    } else {
      let errorMsg = """
      ⚠️ ERROR: Google Maps API key not found!
      
      To fix this:
      1. Add your Google Maps API key to the .env file:
         EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
      
      2. Rebuild the app using:
         npx expo run:ios
      
      Note: Building directly in Xcode may not substitute environment variables.
      Use 'npx expo run:ios' to ensure the API key is properly injected.
      """
      print(errorMsg)
      // Still try to initialize with empty string to avoid crash, but maps won't work
      GMSServices.provideAPIKey("")
    }

    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)

#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // Linking API
  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
  }

  // Universal Links
  public override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    let result = RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    return super.application(application, continue: userActivity, restorationHandler: restorationHandler) || result
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  // Extension point for config-plugins

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // needed to return the correct URL for expo-dev-client.
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
