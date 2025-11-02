# 🚀 Quick Reference - EAS Build Commands

## Kiểm Tra Trước Khi Build

```bash
# Check environment
npm run check-build

# Hoặc chạy trực tiếp script
bash scripts/check-build-env.sh
```

## Build Commands

### Preview (Internal Testing)
```bash
# Android APK
npm run build:preview:android
# hoặc
eas build --profile preview --platform android

# iOS
npm run build:preview:ios
# hoặc
eas build --profile preview --platform ios

# Cả 2 platforms
npm run build:preview:all
```

### Production (Store Release)
```bash
# Android AAB (for Play Store)
npm run build:production:android

# iOS (for App Store)
npm run build:production:ios
```

### Development
```bash
# Build development client
eas build --profile development --platform android
```

## Prebuild (Generate Native Code)

```bash
# Generate native code
npm run prebuild

# Clean và generate lại
npm run prebuild:clean
```

## Build với Options

### Build Local (thay vì cloud)
```bash
eas build --profile preview --platform android --local
```

### Clear Cache
```bash
eas build --profile preview --platform android --clear-cache
```

### Non-interactive Mode
```bash
eas build --profile preview --platform android --non-interactive
```

## Troubleshooting Commands

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Build Cache
```bash
eas build --clear-cache
```

### Clean Native Folders
```bash
# Xóa native folders
rm -rf android ios

# Regenerate
npx expo prebuild --clean
```

### Check EAS Login
```bash
# Check who you're logged in as
eas whoami

# Login
eas login

# Logout
eas logout
```

## View Build Status

### Web Dashboard
```
https://expo.dev/accounts/[username]/projects/face-attendance-mobile/builds
```

### CLI
```bash
# List recent builds
eas build:list

# View specific build
eas build:view [build-id]
```

## Download Built App

```bash
# Download APK/IPA
eas build:download [build-id]

# Download latest
eas build:download --platform android --profile preview
```

## Submit to Store

```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

## Environment Info

```bash
# Check Expo CLI version
npx expo --version

# Check EAS CLI version
eas --version

# Check Node version
node -v

# Check npm version
npm -v
```

## Common Issues & Quick Fixes

### "Not logged in to EAS"
```bash
eas login
```

### "Google services file not found"
```bash
# Ensure google-services.json exists in root
ls -la google-services.json
```

### "Build failed with gradle error"
```bash
eas build --clear-cache --profile preview --platform android
```

### "Module not found: react-native-vision-camera"
```bash
rm -rf node_modules
npm install
eas build --profile preview --platform android
```

### "Camera permission denied"
Check `app.json` has correct permissions in `android.permissions` and `ios.infoPlist`

---

## 📱 Installation URLs

After build completes, you'll get:
- **QR Code** - Scan to install directly
- **Download URL** - Direct download link
- **Expo Dashboard** - View in web interface

## 🔄 Build Flow

1. `npm run check-build` - Check environment ✅
2. `npm install` - Ensure dependencies updated ✅
3. `npm run build:preview:android` - Start build 🚀
4. Wait for build to complete (~10-20 mins) ⏳
5. Download APK from dashboard 📥
6. Install on device 📱
7. Test features ✅

---

**Need help?** Check:
- [BUILD_GUIDE.md](./BUILD_GUIDE.md)
- [PRE_BUILD_CHECKLIST.md](./PRE_BUILD_CHECKLIST.md)
- [BUILD_CONFIGURATION_CHANGES.md](./BUILD_CONFIGURATION_CHANGES.md)
