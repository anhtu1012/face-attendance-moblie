# Pre-Build Checklist

## ✅ Checklist Trước Khi Build Preview

### 1. Environment Setup
- [ ] Đã cài đặt EAS CLI: `npm install -g eas-cli`
- [ ] Đã đăng nhập EAS: `eas login`
- [ ] Đã có project ID trong `app.json`

### 2. Cấu Hình Files
- [ ] File `eas.json` đã được cấu hình đúng profile preview
- [ ] File `app.json` có đầy đủ plugins và permissions
- [ ] File `google-services.json` tồn tại trong root folder (cho Android)
- [ ] File `package.json` có đầy đủ dependencies

### 3. Native Dependencies Check
Kiểm tra các native dependencies đã được khai báo trong `app.json` plugins:

- [ ] `react-native-vision-camera` - Plugin được khai báo
- [ ] `expo-camera` - Built-in với Expo
- [ ] `expo-build-properties` - Cấu hình minSdkVersion
- [ ] Camera permissions được khai báo trong Android manifest

### 4. Build Configuration

#### Android:
- [ ] `android.package` trong `app.json` đúng format
- [ ] `googleServicesFile` path đúng
- [ ] Permissions được khai báo đầy đủ
- [ ] minSdkVersion >= 26 (cho ML Kit)

#### iOS:
- [ ] `ios.bundleIdentifier` trong `app.json` đúng format
- [ ] Camera usage description được khai báo
- [ ] `ios.infoPlist` có đầy đủ permissions

### 5. Dependencies
```bash
# Kiểm tra dependencies
npm install

# Clean install nếu cần
rm -rf node_modules package-lock.json
npm install
```

### 6. Test Local (Optional nhưng khuyến nghị)
```bash
# Test development build trước
npx expo start --dev-client

# Hoặc build development local
eas build --profile development --platform android --local
```

### 7. Build Preview
```bash
# Build preview trên EAS cloud
eas build --profile preview --platform android

# Hoặc build local để debug
eas build --profile preview --platform android --local
```

## 🔧 Common Issues & Fixes

### Issue 1: "Error: Cannot find module 'react-native-vision-camera'"
**Fix:**
```bash
rm -rf node_modules
npm install
npx expo prebuild --clean
eas build --profile preview --platform android
```

### Issue 2: "Google Services plugin requires google-services.json"
**Fix:**
1. Download `google-services.json` từ Firebase Console
2. Đặt file vào root folder của project
3. Rebuild

### Issue 3: "Camera permission denied"
**Fix:**
Thêm vào `app.json`:
```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs camera access",
        "NSMicrophoneUsageDescription": "This app needs microphone access"
      }
    }
  }
}
```

### Issue 4: "Build failed with gradle error"
**Fix:**
```bash
# Clear gradle cache
cd android
./gradlew clean
cd ..

# Rebuild
eas build --profile preview --platform android --clear-cache
```

### Issue 5: "Face detector not working"
**Fix:**
1. Verify `google-services.json` is present
2. Check ML Kit dependencies in `android/app/build.gradle`
3. Ensure internet connection on first run (ML Kit downloads models)

## 📱 Testing Built App

### Android APK:
1. Download APK từ EAS build page
2. Install trên thiết bị Android
3. Test features:
   - [ ] Camera mở được
   - [ ] Face detection hoạt động
   - [ ] Timekeeping
   - [ ] Navigation
   - [ ] API calls

### iOS IPA:
1. Download từ EAS build page
2. Install via TestFlight hoặc ad-hoc distribution
3. Test tương tự Android

## 🚀 Ready to Build?

Khi đã check hết các items trên:
```bash
# Final build command
eas build --profile preview --platform android
```

Build URL sẽ hiện ra sau khi submit, track progress tại:
https://expo.dev/accounts/[your-account]/projects/face-attendance-mobile/builds
