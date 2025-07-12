const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Universal Links - Apple App Site Association
app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    applinks: {
      apps: [],
      details: [
        {
          "appID": "YL6S7CMQGW.com.mariages.io.debug",
          "paths": [
            "/*"
          ]
        }
      ]
    }
  });
});

// Android App Links - Asset Links
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      "target": {
        "namespace": "android_app",
        "package_name": "com.mariages.io.debug",
        "sha256_cert_fingerprints": [
          "FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C"
        ]
      }
    }
  ]);
});

// Test routes for universal links
app.get('/test/:id', (req, res) => {
  const testId = req.params.id;
  res.json({
    message: 'Universal link test successful!',
    testId: testId,
    timestamp: new Date().toISOString(),
    platform: req.headers['user-agent'] || 'Unknown'
  });
});

app.get('/vendors', (req, res) => {
  const test = req.query.test;
  res.json({
    message: 'Vendors universal link test',
    timestamp: new Date().toISOString(),
    platform: req.headers['user-agent'] || 'Unknown',
    test: test
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    server: 'Universal Link Tester'
  });
});

// Root endpoint with testing instructions
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Universal Link Tester</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
            .code { background: #e0e0e0; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
            h2 { color: #333; }
            .note { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <h1>🔗 Universal Link Tester</h1>
        <p>This server is running on <strong>http://localhost:${PORT}</strong></p>
        
        <h2>📋 Available Endpoints</h2>
        
        <div class="endpoint">
            <h3>Apple App Site Association</h3>
            <p><code>GET /.well-known/apple-app-site-association</code></p>
            <p>Returns the Apple App Site Association file for iOS universal links.</p>
        </div>
        
        <div class="endpoint">
            <h3>Android Asset Links</h3>
            <p><code>GET /.well-known/assetlinks.json</code></p>
            <p>Returns the Asset Links file for Android app links.</p>
        </div>
        
        <div class="endpoint">
            <h3>Test Routes</h3>
            <p><code>GET /test/:id</code> - Test universal link with ID</p>
            <p><code>GET /profile/:userId</code> - Profile universal link test</p>
            <p><code>GET /settings</code> - Settings universal link test</p>
        </div>
        
        <div class="endpoint">
            <h3>Health Check</h3>
            <p><code>GET /health</code> - Server health status</p>
        </div>
        
        <h2>🧪 Testing Instructions</h2>
        
        <div class="note">
            <h3>For iOS Development:</h3>
            <ol>
                <li>Update the <code>TEAM_ID</code> and <code>BUNDLE_ID</code> in the apple-app-site-association file</li>
                <li>Add your domain to your iOS app's Associated Domains capability</li>
                <li>Test with URLs like: <code>http://localhost:${PORT}/test/123</code></li>
            </ol>
        </div>
        
        <div class="note">
            <h3>For Android Development:</h3>
            <ol>
                <li>Update the <code>package_name</code> and <code>sha256_cert_fingerprints</code> in assetlinks.json</li>
                <li>Add intent filters to your Android manifest</li>
                <li>Test with URLs like: <code>http://localhost:${PORT}/profile/user123</code></li>
            </ol>
        </div>
        
        <h2>🔧 Configuration</h2>
        <p>Edit the server.js file to customize:</p>
        <ul>
            <li>App IDs and bundle identifiers</li>
            <li>Supported URL paths</li>
            <li>Certificate fingerprints</li>
        </ul>
        
        <h2>📱 Quick Test Links</h2>
        <p>Try these links in your mobile browser or app:</p>
        <ul>
            <li><a href="/test/123">Test Link 1</a></li>
            <li><a href="/profile/user456">Profile Link</a></li>
            <li><a href="/settings">Settings Link</a></li>
        </ul>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Universal Link Tester server running on http://localhost:${PORT}`);
  console.log(`📱 Apple App Site Association: http://localhost:${PORT}/.well-known/apple-app-site-association`);
  console.log(`🤖 Android Asset Links: http://localhost:${PORT}/.well-known/assetlinks.json`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
}); 