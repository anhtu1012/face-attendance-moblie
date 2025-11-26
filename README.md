# Face Attendance Mobile 📱

Ứng dụng chấm công bằng nhận diện khuôn mặt, được xây dựng với Expo và React Native.

## 🚀 Quick Start

### Development

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

### Building

#### Local APK Build (After Changing Assets)
```bash
# Khi bạn thay đổi images/assets và cần build lại
npm run rebuild:assets

# Hoặc build và cài luôn
npm run rebuild:assets:install
```
> ⚠️ **Important:** Khi thay đổi assets (images, icons, splash), phải dùng `rebuild:assets` để đảm bảo native modules (camera, face detector) vẫn hoạt động!

#### Preview Build (Internal Testing)
```bash
# Kiểm tra environment trước
npm run check-build

# Build cho Android
npm run build:preview:android

# Build cho iOS
npm run build:preview:ios
```

#### Production Build
```bash
# Android
npm run build:production:android

# iOS
npm run build:production:ios
```

## 📚 Documentation

- 🔧 **[BUILD_CONFIGURATION_CHANGES.md](./BUILD_CONFIGURATION_CHANGES.md)** - Tổng quan về cấu hình build
- 📖 **[BUILD_GUIDE.md](./BUILD_GUIDE.md)** - Hướng dẫn build chi tiết
- 🔄 **[REBUILD_GUIDE.md](./REBUILD_GUIDE.md)** - **Hướng dẫn rebuild sau khi thay đổi assets**
- ✅ **[PRE_BUILD_CHECKLIST.md](./PRE_BUILD_CHECKLIST.md)** - Checklist trước khi build

## 🛠️ Tech Stack

### Core
- **Expo SDK 54** - React Native framework
- **React Native 0.81** - Mobile framework
- **TypeScript** - Type safety
- **Expo Router** - File-based routing

### Native Features
- **react-native-vision-camera** - Camera access & capture
- **react-native-vision-camera-face-detector** - Face detection with ML Kit
- **react-native-worklets-core** - High-performance worklets
- **react-native-reanimated** - Smooth animations
- **expo-local-authentication** - Biometric authentication

### State & Data
- **Redux Toolkit** - State management
- **TanStack Query** - Server state management
- **Axios** - HTTP client

## 🔑 Key Features

- ✅ Nhận diện khuôn mặt real-time
- ✅ Chấm công check-in/check-out
- ✅ Quản lý lịch làm việc
- ✅ Xem timesheet theo ngày/tuần/tháng
- ✅ Quản lý hợp đồng
- ✅ Tính lương
- ✅ Notifications
- ✅ Dark mode

## 📱 Development Options

You can develop using:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/) - Recommended for native modules
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

**Note:** Expo Go không hỗ trợ do app sử dụng native modules custom.

## 📂 Project Structure

```
app/              # File-based routing (Expo Router)
components/       # React components
hooks/            # Custom hooks
api/              # API client functions
models/           # TypeScript types/interfaces
services/         # Business logic services
utils/            # Utility functions
constants/        # App constants
```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
