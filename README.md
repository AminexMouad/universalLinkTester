# Universal Link Tester

A simple Express.js server for testing universal links (iOS) and app links (Android) locally during development.

## Features

- ✅ Apple App Site Association endpoint (`/.well-known/apple-app-site-association`)
- ✅ Android Asset Links endpoint (`/.well-known/assetlinks.json`)
- ✅ Test routes for universal link validation
- ✅ Health check endpoint
- ✅ Interactive web interface with testing instructions
- ✅ CORS enabled for cross-origin requests

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   npm start
   ```

   Or for development with auto-restart:

   ```bash
   npm run dev
   ```

3. **Access the server:**
   - Main interface: http://localhost:3000
   - Apple App Site Association: http://localhost:3000/.well-known/apple-app-site-association
   - Android Asset Links: http://localhost:3000/.well-known/assetlinks.json
   - Health check: http://localhost:3000/health

## Configuration

### For iOS Universal Links

1. **Update the Apple App Site Association file** in `server.js`:

   ```javascript
   appID: 'TEAM_ID.BUNDLE_ID', // Replace with your actual values
   ```

2. **Add your domain to your iOS app's Associated Domains capability:**

   - Open your iOS project in Xcode
   - Go to your app target → Signing & Capabilities
   - Add "Associated Domains" capability
   - Add: `applinks:localhost:3000`

3. **Handle universal links in your iOS app:**
   ```swift
   // In your AppDelegate or SceneDelegate
   func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
       if userActivity.activityType == NSUserActivityTypeBrowsingWeb {
           let url = userActivity.webpageURL!
           // Handle the URL in your app
           return true
       }
       return false
   }
   ```

### For Android App Links

1. **Update the Asset Links file** in `server.js`:

   ```javascript
   package_name: 'com.example.myapp', // Replace with your package name
   sha256_cert_fingerprints: ['SHA256_FINGERPRINT'] // Replace with your certificate fingerprint
   ```

2. **Add intent filters to your AndroidManifest.xml:**

   ```xml
   <activity android:name=".MainActivity">
       <intent-filter android:autoVerify="true">
           <action android:name="android.intent.action.VIEW" />
           <category android:name="android.intent.category.DEFAULT" />
           <category android:name="android.intent.category.BROWSABLE" />
           <data android:scheme="http" android:host="localhost" android:port="3000" />
       </intent-filter>
   </activity>
   ```

3. **Handle app links in your Android app:**

   ```kotlin
   override fun onCreate(savedInstanceState: Bundle?) {
       super.onCreate(savedInstanceState)

       intent?.data?.let { uri ->
           // Handle the URI in your app
           handleDeepLink(uri)
       }
   }
   ```

## Test Routes

The server provides several test endpoints:

- `GET /test/:id` - Test universal link with dynamic ID
- `GET /profile/:userId` - Profile page universal link test
- `GET /settings` - Settings page universal link test

### Example Test URLs

- http://localhost:3000/test/123
- http://localhost:3000/profile/user456
- http://localhost:3000/settings

## Development

### Project Structure

```
universalLinkTester/
├── server.js          # Main Express server
├── package.json       # Dependencies and scripts
├── README.md         # This file
└── public/           # Static files (if needed)
```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

## Troubleshooting

### Common Issues

1. **Universal links not working on iOS:**

   - Ensure your domain is added to Associated Domains capability
   - Check that the apple-app-site-association file is accessible
   - Verify your app ID matches exactly

2. **App links not working on Android:**

   - Ensure `android:autoVerify="true"` is set in your intent filter
   - Verify the assetlinks.json file is accessible
   - Check that certificate fingerprints match exactly

3. **Localhost not working on device:**

   - Use your computer's local IP address instead of localhost
   - Ensure your device is on the same network
   - Try using ngrok for external access: `ngrok http 3000`

4. **ngrok connection issues:**

   - Ensure your Express server is running on port 3000
   - Check that ngrok is properly authenticated
   - Verify the ngrok URL is accessible from your mobile device
   - Try restarting both the Express server and ngrok

5. **SSL/HTTPS issues:**
   - ngrok provides HTTPS automatically
   - Make sure you're using the `https://` URL, not `http://`
   - Check that your association files are served with correct Content-Type headers

## Why ngrok is Required for Universal Links

Universal links have specific requirements that make localhost testing difficult:

### 🚫 **Problems with localhost:**

1. **iOS Universal Links** - Apple doesn't allow localhost for production universal links
2. **HTTPS Requirement** - Universal links require HTTPS (localhost is HTTP by default)
3. **Domain Validation** - iOS and Android validate domains against their respective association files
4. **Network Restrictions** - Mobile devices can't access localhost from external networks

### ✅ **Why ngrok solves these issues:**

- **HTTPS Support** - ngrok provides HTTPS URLs automatically
- **Public Domain** - Creates a public URL that works from any device
- **SSL Certificate** - Provides valid SSL certificates for domain validation
- **Tunnel Service** - Securely tunnels external requests to your local server

## Setting up ngrok for Universal Link Testing

### Step 1: Install ngrok

```bash
# Using Homebrew (recommended)
brew install ngrok/ngrok/ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Sign up for ngrok account

1. Go to https://ngrok.com/signup
2. Create a free account
3. Get your authtoken from the dashboard

### Step 3: Configure ngrok

```bash
# Add your authtoken (replace YOUR_AUTH_TOKEN with your actual token)
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Step 4: Start your Express server

```bash
# Install dependencies (if not done already)
npm install

# Start the server
npm start
```

### Step 5: Start ngrok tunnel

```bash
# In a new terminal window, start ngrok
ngrok http 3000
```

### Step 6: Update your app configuration

After starting ngrok, you'll get a URL like `https://abc123.ngrok.io`. Update your app configuration:

#### For iOS:

1. **Update Associated Domains** in your iOS app:
   - Add: `applinks:abc123.ngrok.io` (replace with your ngrok URL)
2. **Test the association file**:
   - Visit: `https://abc123.ngrok.io/.well-known/apple-app-site-association`

#### For Android:

1. **Update your AndroidManifest.xml**:
   ```xml
   <data android:scheme="https" android:host="abc123.ngrok.io" />
   ```
2. **Test the asset links file**:
   - Visit: `https://abc123.ngrok.io/.well-known/assetlinks.json`

### Step 7: Test your universal links

Use the ngrok URL in your tests:

- `https://abc123.ngrok.io/test/123`
- `https://abc123.ngrok.io/vendors`
- `https://abc123.ngrok.io/profile/user456`

## Testing Deep Links in React Native

This universal link tester is designed to work with React Native apps. Here's how to test deep links properly:

### Using npx uri-scheme (Recommended)

The `uri-scheme` package is the most reliable way to test deep links in React Native:

#### Install uri-scheme (no global installation needed):

```bash
# No installation needed - npx will download and run uri-scheme automatically
```

#### Test deep links from command line:

```bash
# Test iOS deep links
npx uri-scheme open "https://abc123.ngrok.io/test/123" --ios

# Test Android deep links
npx uri-scheme open "https://abc123.ngrok.io/vendors" --android

# Test with query parameters
npx uri-scheme open "https://abc123.ngrok.io/vendors?test=123" --ios

# Alternative: You can also use npx without the --ios/--android flags
npx uri-scheme open "https://abc123.ngrok.io/test/123"
```

#### Test specific app scenarios:

```bash
# Test profile deep link
npx uri-scheme open "https://abc123.ngrok.io/profile/user456" --ios

# Test settings deep link
npx uri-scheme open "https://abc123.ngrok.io/settings" --android

# Test with custom parameters
npx uri-scheme open "https://abc123.ngrok.io/test/789?platform=ios&version=1.0" --ios
```

### Alternative Testing Methods

#### 1. Using React Native CLI:

```bash
# iOS Simulator
npx react-native run-ios --simulator="iPhone 14"

# Android Emulator
npx react-native run-android
```

#### 2. Using Xcode (iOS):

1. Open your iOS project in Xcode
2. Go to Product → Scheme → Edit Scheme
3. Add launch arguments: `-FIRDebugEnabled`
4. Use Safari to navigate to your ngrok URL

#### 3. Using Android Studio (Android):

1. Open your Android project in Android Studio
2. Use ADB to test deep links:
   ```bash
   adb shell am start -W -a android.intent.action.VIEW -d "https://abc123.ngrok.io/test/123" com.mariages.io.debug
   ```

### React Native Deep Link Configuration

Make sure your React Native app is properly configured:

#### For iOS (Info.plist):

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.mariages.io.debug</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>https</string>
    </array>
  </dict>
</array>
```

#### For Android (AndroidManifest.xml):

```xml
<activity android:name=".MainActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="abc123.ngrok.io" />
  </intent-filter>
</activity>
```

### Debugging Deep Links

#### Check if deep links are working:

```bash
# iOS - Check if app opens
npx uri-scheme open "https://abc123.ngrok.io/test/123" --ios

# Android - Check if app opens
npx uri-scheme open "https://abc123.ngrok.io/test/123" --android

# If app doesn't open, check the association files:
curl https://abc123.ngrok.io/.well-known/apple-app-site-association
curl https://abc123.ngrok.io/.well-known/assetlinks.json
```

#### Common React Native deep link issues:

1. **App not opening**: Check if your app's bundle ID matches the association file
2. **Wrong screen opening**: Verify your React Navigation configuration
3. **Parameters not passed**: Check your deep link parsing logic
4. **HTTPS required**: Make sure you're using the ngrok HTTPS URL, not HTTP

### Using ngrok for External Access

If you need to test from a physical device, use ngrok:

1. **Install ngrok:**

   ```bash
   npm install -g ngrok
   ```

2. **Start your Express server:**

   ```bash
   npm start
   ```

3. **Start ngrok:**

   ```bash
   ngrok http 3000
   ```

4. **Use the ngrok URL** (e.g., `https://abc123.ngrok.io`) in your app configuration instead of localhost.

## License

MIT License - feel free to use this project for your universal link testing needs!
