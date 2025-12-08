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
    
    // Strategy 1: Try to get from Config.plist (works when building from Xcode)
    if let configPath = Bundle.main.path(forResource: "Config", ofType: "plist"),
       let config = NSDictionary(contentsOfFile: configPath),
       let key = config["GOOGLE_MAPS_API_KEY"] as? String,
       !key.isEmpty {
      apiKey = key
      print("📍 Loaded Google Maps API key from Config.plist")
    }
    
    // Strategy 2: Try to get from Info.plist (works when building via expo)
    if apiKey == nil || apiKey?.isEmpty == true {
      if let plistKey = Bundle.main.object(forInfoDictionaryKey: "GMSApiKey") as? String,
         !plistKey.isEmpty,
         plistKey != "${EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}" {
        apiKey = plistKey
        print("📍 Loaded Google Maps API key from Info.plist")
      }
    }
    
    // Strategy 3: Try environment variable (for development)
    if apiKey == nil || apiKey?.isEmpty == true {
      if let envKey = ProcessInfo.processInfo.environment["EXPO_PUBLIC_GOOGLE_MAPS_API_KEY"],
         !envKey.isEmpty {
        apiKey = envKey
        print("📍 Loaded Google Maps API key from environment variable")
      }
    }
    
    // Initialize Google Maps with the API key
    if let key = apiKey, !key.isEmpty {
      GMSServices.provideAPIKey(key)
      print("✅ Google Maps SDK initialized successfully with key: \(String(key.prefix(10)))...")
    } else {
      let errorMsg = """
      ⚠️ ERROR: Google Maps API key not found!
      
      To fix this:
      1. For Xcode builds: Ensure Config.plist exists in ios/GoBuddy/ with your API key
      2. For Expo builds: Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file
      
      Note: The API key must be valid and have Maps SDK for iOS enabled.
      """
      print(errorMsg)
      // Don't initialize with empty key - let it fail properly
      fatalError("Google Maps API key is required. Please configure Config.plist or .env file.")
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
