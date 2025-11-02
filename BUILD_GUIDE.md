# Hướng Dẫn Build Preview với Native Libraries

## Vấn Đề
Dự án sử dụng nhiều thư viện React Native native modules như:
- `react-native-vision-camera` 
- `react-native-vision-camera-face-detector`
- `react-native-worklets-core`
- `react-native-fs`
- `react-native-zip-archive`
- v.v.

Các thư viện này cần được compile native code, không thể chạy với Expo Go hoặc development client đơn giản.

## Giải Pháp

### 1. Sử dụng EAS Build đã được cấu hình

File `eas.json` đã được cập nhật với cấu hình đúng cho preview build:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      },
      "ios": {
        "buildConfiguration": "Release"
      },
      "channel": "preview",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 2. Build Commands

#### Build Preview cho Android:
```bash
eas build --profile preview --platform android
```

#### Build Preview cho iOS:
```bash
eas build --profile preview --platform ios
```

#### Build cho cả hai platforms:
```bash
eas build --profile preview --platform all
```

### 3. Lưu Ý Quan Trọng

#### ✅ Profile Preview sẽ:
- Build native code đầy đủ
- Tạo file APK standalone (Android) hoặc IPA (iOS)
- Bao gồm tất cả native modules
- Chạy trong môi trường production
- Không cần Expo Go

#### ❌ Không sử dụng:
- `expo start` - chỉ cho development với Expo Go
- `expo run:android` trong môi trường không có native setup đầy đủ
- Development client cho preview builds

### 4. Test Build Local (Optional)

Nếu muốn test local trước khi build trên EAS:

#### Android:
```bash
# Cài đặt dependencies
npm install

# Pre-build để generate native code
npx expo prebuild --platform android

# Build APK local
cd android
./gradlew assembleRelease

# File APK sẽ ở: android/app/build/outputs/apk/release/app-release.apk
```

#### iOS:
```bash
# Cài đặt dependencies
npm install

# Pre-build để generate native code
npx expo prebuild --platform ios

# Mở Xcode
cd ios
open FaceAttendanceMobile.xcworkspace

# Build từ Xcode với scheme Release
```

### 5. Troubleshooting

#### Lỗi: "Module not found" khi chạy app
- **Nguyên nhân**: Native modules chưa được link
- **Giải pháp**: Build lại với EAS hoặc chạy `npx expo prebuild --clean`

#### Lỗi: Gradle build failed
- **Nguyên nhân**: Thiếu cấu hình Android
- **Giải pháp**: 
  - Kiểm tra `android/build.gradle` có đầy đủ repositories
  - Xóa folder `android` và chạy `npx expo prebuild`

#### Lỗi: Camera không hoạt động
- **Nguyên nhân**: Thiếu permissions trong manifest
- **Giải pháp**: 
  - Kiểm tra `app.json` có cấu hình đúng permissions
  - Rebuild app với EAS

#### Lỗi: Face detector không hoạt động
- **Nguyên nhân**: ML Kit chưa được include trong build
- **Giải pháp**:
  - Thêm `google-services.json` vào `android/app/`
  - Ensure Google Services plugin được apply trong `android/app/build.gradle`

### 6. Kiểm Tra Build

Sau khi build xong, test các tính năng:
- ✅ Camera mở được
- ✅ Face detection hoạt động
- ✅ Timekeeping với camera
- ✅ File picker
- ✅ Notifications
- ✅ Local authentication

### 7. Distribution

#### Internal Testing (Preview):
```bash
# Build và tự động upload lên internal distribution
eas build --profile preview --platform android

# Scan QR code để cài đặt trên thiết bị
```

#### Production:
```bash
# Build production
eas build --profile production --platform android

# Submit lên Google Play
eas submit --platform android
```

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Vision Camera Setup](https://react-native-vision-camera.com/docs/guides/)
- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
