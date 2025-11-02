# 🔧 Cấu Hình Build Đã Được Cập Nhật

## Các Thay Đổi

### 1. File `eas.json` ✅
Đã được cấu hình lại để build preview hoạt động đúng với native libraries:

**Thay đổi chính:**
- ✅ Preview profile không sử dụng development client
- ✅ Build với Release configuration
- ✅ Gradle command đúng cho Android
- ✅ Environment variables được set production

**Kết quả:**
- Preview build sẽ tạo APK standalone đầy đủ
- Tất cả native modules sẽ được compile
- App có thể chạy độc lập không cần Expo Go

### 2. File `package.json` ✅
Đã thêm các scripts tiện ích:

```bash
# Kiểm tra environment trước khi build
npm run check-build

# Build preview Android
npm run build:preview:android

# Build preview iOS
npm run build:preview:ios

# Build preview cả 2 platforms
npm run build:preview:all

# Build production
npm run build:production:android
npm run build:production:ios

# Prebuild (generate native code)
npm run prebuild
npm run prebuild:clean
```

### 3. Files Hướng Dẫn Mới

#### 📄 `BUILD_GUIDE.md`
Hướng dẫn chi tiết về:
- Cách build preview
- Troubleshooting common issues
- Local testing
- Distribution

#### 📄 `PRE_BUILD_CHECKLIST.md`
Checklist đầy đủ trước khi build:
- Environment setup
- Configuration files
- Dependencies check
- Common fixes

#### 📄 `scripts/check-build-env.sh`
Script tự động kiểm tra:
- Node.js & npm
- EAS CLI
- Authentication
- Configuration files
- Dependencies

## Cách Sử Dụng

### 🚀 Quick Start

```bash
# 1. Kiểm tra môi trường
npm run check-build

# 2. Cài đặt dependencies (nếu cần)
npm install

# 3. Build preview
npm run build:preview:android
```

### 📱 Build Commands

#### Development Build (có hot reload):
```bash
eas build --profile development --platform android
```

#### Preview Build (test internal):
```bash
npm run build:preview:android
# hoặc
eas build --profile preview --platform android
```

#### Production Build (publish store):
```bash
npm run build:production:android
# hoặc
eas build --profile production --platform android
```

## Điểm Khác Biệt Giữa Các Profile

| Feature | Development | Preview | Production |
|---------|------------|---------|------------|
| Development Client | ✅ Yes | ❌ No | ❌ No |
| Native Modules | ✅ Full | ✅ Full | ✅ Full |
| Hot Reload | ✅ Yes | ❌ No | ❌ No |
| Minified | ❌ No | ✅ Yes | ✅ Yes |
| Distribution | Internal | Internal | Store |
| Use Case | Development | Internal Testing | End Users |

## Tại Sao Preview Build Gặp Lỗi Trước Đây?

### Vấn Đề Cũ:
```json
{
  "preview": {
    "distribution": "internal"
  }
}
```
- Không có cấu hình build type rõ ràng
- Có thể bị nhầm với development client
- Native modules không được compile đúng

### Giải Pháp Mới:
```json
{
  "preview": {
    "distribution": "internal",
    "android": {
      "buildType": "apk",
      "gradleCommand": ":app:assembleRelease"
    },
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```
- Build type được chỉ định rõ ràng (APK)
- Gradle command đúng (assembleRelease)
- Environment production mode
- Không có development client

## Các Native Libraries Trong Project

Dự án sử dụng các native libraries sau:

### Camera & Face Detection:
- ✅ `react-native-vision-camera` - Camera access
- ✅ `react-native-vision-camera-face-detector` - Face detection
- ✅ `expo-camera` - Expo camera

### Worklets & Performance:
- ✅ `react-native-worklets-core` - Worklets runtime
- ✅ `react-native-reanimated` - Animations

### File System:
- ✅ `react-native-fs` - File system access
- ✅ `react-native-zip-archive` - ZIP operations
- ✅ `expo-file-system` - Expo file system

### UI & Gestures:
- ✅ `react-native-gesture-handler` - Gestures
- ✅ `react-native-screens` - Native screens
- ✅ `react-native-safe-area-context` - Safe area

### Other:
- ✅ `react-native-webview` - WebView
- ✅ `react-native-svg` - SVG rendering
- ✅ `expo-local-authentication` - Biometric auth
- ✅ `expo-notifications` - Push notifications

**Tất cả các libraries này đều cần native code compilation!**

## Kiểm Tra Build Thành Công

Sau khi build xong, test các features:

### ✅ Camera & Face Detection
- [ ] Camera mở được
- [ ] Face detection hoạt động
- [ ] Timekeeping với face capture

### ✅ File Operations
- [ ] Document picker hoạt động
- [ ] File system operations
- [ ] ZIP/Unzip files

### ✅ UI/UX
- [ ] Gestures smooth
- [ ] Animations hoạt động
- [ ] Navigation smooth

### ✅ Integrations
- [ ] API calls thành công
- [ ] Notifications hoạt động
- [ ] Local auth (biometric)

## Troubleshooting

### Build Failed?
```bash
# Clear cache và rebuild
eas build --profile preview --platform android --clear-cache
```

### Camera Not Working?
1. Check permissions in `app.json`
2. Verify `react-native-vision-camera` plugin config
3. Rebuild app

### Face Detection Not Working?
1. Ensure `google-services.json` exists
2. Check internet connection (first run downloads ML models)
3. Verify ML Kit dependencies

### APK Install Failed?
1. Uninstall old version
2. Enable "Install from Unknown Sources"
3. Check APK signature

## Support & Resources

- 📖 [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Chi tiết build guide
- ✅ [PRE_BUILD_CHECKLIST.md](./PRE_BUILD_CHECKLIST.md) - Checklist đầy đủ
- 🔧 [scripts/check-build-env.sh](./scripts/check-build-env.sh) - Check script

**EAS Build Documentation:**
- https://docs.expo.dev/build/introduction/
- https://docs.expo.dev/build-reference/eas-json/

**Native Modules:**
- https://react-native-vision-camera.com/
- https://docs.expo.dev/workflow/prebuild/

---

✅ **Tóm lại:** File `eas.json` đã được cấu hình đúng để build preview với tất cả native libraries. Chỉ cần chạy `npm run build:preview:android` là được!
