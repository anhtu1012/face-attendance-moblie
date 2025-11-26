#!/bin/bash

echo "🔄 Rebuilding app with new assets while preserving native modules..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clean previous build
echo -e "${YELLOW}📦 Step 1: Cleaning previous builds...${NC}"
cd android
./gradlew clean
cd ..

# Step 2: Prebuild to regenerate native code with new assets
echo -e "${YELLOW}🔧 Step 2: Running prebuild to include new assets...${NC}"
npx expo prebuild --platform android

# Step 3: Build release APK
echo -e "${YELLOW}🏗️  Step 3: Building release APK...${NC}"
cd android
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo -e "${GREEN}📱 APK location: android/app/build/outputs/apk/release/app-release.apk${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

cd ..
