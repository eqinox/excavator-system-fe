# iOS Network Configuration with ngrok

Due to iOS network restrictions, you need to set up ngrok for iOS testing:

## Step 1: Install ngrok

```bash
# Download from https://ngrok.com/download
# Or install via npm
npm install -g ngrok
```

## Step 2: Get your auth token

1. Go to https://ngrok.com/ and sign up
2. Visit https://dashboard.ngrok.com/get-started/your-authtoken
3. Copy your auth token

## Step 3: Configure ngrok

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

## Step 4: Start the tunnel

```bash
ngrok http 5000
```

You'll see output like:

```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:5000
```

## Step 5: Update the app

Update `lib/api.ts` with your ngrok URL:

```typescript
} else if (Platform.OS === "ios") {
  return "https://YOUR_NGROK_URL.ngrok-free.app";
}
```

## Step 6: Test

- **Web**: Uses localhost (no tunnel needed)
- **Android**: Uses local IP (no tunnel needed)
- **iOS**: Uses ngrok HTTPS URL

## Troubleshooting

### "Network request failed" on iOS

1. Ensure ngrok is running: `ngrok http 5000`
2. Test in Safari: `https://your-ngrok-url.ngrok-free.app`
3. Update the app with the correct ngrok URL
4. Restart the Expo app

### Server not accessible

1. Make sure your server listens on `0.0.0.0:5000`
2. Check firewall settings
3. Ensure phone and computer are on same WiFi (for Android)
