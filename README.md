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

The server is pre-configured with example app IDs and paths. Update the following in `server.js`:

### Server Configuration

1. **Apple App Site Association** - Update the `appID` field with your actual team ID and bundle identifier
2. **Android Asset Links** - Update the `package_name` and `sha256_cert_fingerprints` with your app's details
3. **Supported Paths** - Modify the `paths` array to match your app's deep link structure

### Current Configuration

The server currently serves:

- **Apple App Site Association**: `/.well-known/apple-app-site-association`
- **Android Asset Links**: `/.well-known/assetlinks.json`
- **Test Endpoints**: `/test/:id`, `/vendors`, `/profile/:userId`, `/settings`

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

1. **Server not starting:**

   - Check if port 3000 is already in use
   - Ensure all dependencies are installed: `npm install`
   - Verify Node.js version compatibility

2. **Association files not accessible:**

   - Check that the server is running on the correct port
   - Verify the file paths in your browser: `http://localhost:3000/.well-known/apple-app-site-association`
   - Ensure the Content-Type headers are set correctly

3. **ngrok connection issues:**

   - Ensure your Express server is running on port 3000
   - Check that ngrok is properly authenticated
   - Verify the ngrok URL is accessible from external devices
   - Try restarting both the Express server and ngrok

4. **SSL/HTTPS issues:**

   - ngrok provides HTTPS automatically
   - Make sure you're using the `https://` URL, not `http://`
   - Check that your association files are served with correct Content-Type headers

5. **JSON formatting issues:**
   - Verify that the association files return valid JSON
   - Check that the app IDs and paths are correctly formatted
   - Test the endpoints with curl to see the raw responses

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

## Testing the Server

### Using curl to test endpoints:

```bash
# Test the Apple App Site Association
curl https://abc123.ngrok.io/.well-known/apple-app-site-association

# Test the Android Asset Links
curl https://abc123.ngrok.io/.well-known/assetlinks.json

# Test the vendors endpoint
curl https://abc123.ngrok.io/vendors

# Test with query parameters
curl "https://abc123.ngrok.io/vendors?test=123"
```

### Using a web browser:

1. Open your browser and navigate to your ngrok URL
2. Visit the test endpoints to see the JSON responses
3. Check that the association files are properly formatted

### Using npx uri-scheme to trigger deep links:

The `uri-scheme` package is useful for testing if your mobile app opens when triggered:

```bash
# Test iOS deep links
npx uri-scheme open "https://abc123.ngrok.io/test/123" --ios

# Test Android deep links
npx uri-scheme open "https://abc123.ngrok.io/vendors" --android

# Test with query parameters
npx uri-scheme open "https://abc123.ngrok.io/vendors?test=123" --ios

# Test profile deep link
npx uri-scheme open "https://abc123.ngrok.io/profile/user456" --ios

# Test settings deep link
npx uri-scheme open "https://abc123.ngrok.io/settings" --android
```

**Note**: This requires your mobile app to be properly configured with the ngrok domain in its deep link settings.

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
