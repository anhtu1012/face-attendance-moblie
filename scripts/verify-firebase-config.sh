#!/bin/bash

# Script to verify Firebase and Notifications configuration

echo "🔍 Verifying Firebase & Notifications Configuration..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

errors=0
warnings=0
checks=0

# Function to check file exists
check_file() {
    local file=$1
    local description=$2
    ((checks++))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description: Found"
        return 0
    else
        echo -e "${RED}✗${NC} $description: Not Found"
        ((errors++))
        return 1
    fi
}

# Function to check content in file
check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    ((checks++))
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $description: OK"
        return 0
    else
        echo -e "${RED}✗${NC} $description: Missing"
        ((errors++))
        return 1
    fi
}

# Function to check JSON key
check_json_key() {
    local file=$1
    local key=$2
    local description=$3
    ((checks++))
    
    if grep -q "\"$key\"" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $description: Found"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $description: Not Found"
        ((warnings++))
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 1. Checking Firebase Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "google-services.json" "google-services.json"
check_file "app.json" "app.json"
check_file "eas.json" "eas.json"
check_file "package.json" "package.json"

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 2. Checking google-services.json Content"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "google-services.json" ]; then
    check_content "google-services.json" "project_info" "Project Info"
    check_content "google-services.json" "project_id" "Project ID"
    check_content "google-services.json" "package_name" "Package Name"
    
    # Check package name matches
    PACKAGE_IN_GOOGLE=$(grep -o '"package_name": "[^"]*"' google-services.json | cut -d'"' -f4)
    PACKAGE_IN_APP=$(grep -o '"package": "[^"]*"' app.json | head -1 | cut -d'"' -f4)
    
    if [ "$PACKAGE_IN_GOOGLE" = "$PACKAGE_IN_APP" ]; then
        echo -e "${GREEN}✓${NC} Package names match: $PACKAGE_IN_GOOGLE"
    else
        echo -e "${RED}✗${NC} Package name mismatch!"
        echo -e "  Google Services: $PACKAGE_IN_GOOGLE"
        echo -e "  app.json: $PACKAGE_IN_APP"
        ((errors++))
    fi
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔌 3. Checking Plugins in app.json"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_content "app.json" "expo-notifications" "expo-notifications plugin"
check_content "app.json" "react-native-vision-camera" "react-native-vision-camera plugin"
check_content "app.json" "expo-build-properties" "expo-build-properties plugin"

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 4. Checking Permissions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_content "app.json" "android.permission.CAMERA" "Camera permission"
check_content "app.json" "android.permission.VIBRATE" "Vibrate permission"
check_content "app.json" "RECEIVE_BOOT_COMPLETED" "Boot completed permission"
check_content "app.json" "com.google.android.c2dm.permission.RECEIVE" "FCM permission"
check_content "app.json" "NSCameraUsageDescription" "iOS Camera permission"

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 5. Checking Build Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_content "app.json" "minSdkVersion" "minSdkVersion"
check_content "app.json" "googleServicesFile" "googleServicesFile path"
check_content "eas.json" "preview" "Preview profile"
check_json_key "eas.json" "googleServicesFile" "googleServicesFile in eas.json"

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 6. Checking Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_content "package.json" "expo-notifications" "expo-notifications package"
check_content "package.json" "react-native-vision-camera" "react-native-vision-camera package"
check_content "package.json" "expo-constants" "expo-constants package"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
    
    # Check specific packages
    if [ -d "node_modules/expo-notifications" ]; then
        echo -e "${GREEN}✓${NC} expo-notifications installed"
    else
        echo -e "${YELLOW}⚠${NC} expo-notifications not installed"
        echo "  Run: npm install"
        ((warnings++))
    fi
else
    echo -e "${YELLOW}⚠${NC} node_modules not found"
    echo "  Run: npm install"
    ((warnings++))
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 7. Checking Android Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "android/app/build.gradle" ]; then
    check_content "android/app/build.gradle" "com.google.gms.google-services" "Google Services plugin"
    echo -e "${GREEN}✓${NC} android/app/build.gradle exists"
else
    echo -e "${YELLOW}⚠${NC} android/app/build.gradle not found"
    echo "  Run: npx expo prebuild"
    ((warnings++))
fi

if [ -f "android/build.gradle" ]; then
    check_content "android/build.gradle" "google-services" "Google Services classpath"
else
    echo -e "${YELLOW}⚠${NC} android/build.gradle not found"
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Total Checks: $checks"
echo -e "Errors: ${RED}$errors${NC}"
echo -e "Warnings: ${YELLOW}$warnings${NC}"
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "🚀 Ready to build!"
    echo "Run: eas build --profile preview --platform android"
    echo ""
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ No errors, but $warnings warning(s) found${NC}"
    echo ""
    echo "You can proceed, but fix warnings if build fails."
    echo ""
    exit 0
else
    echo -e "${RED}✗ Found $errors error(s)${NC}"
    echo ""
    echo "❌ Please fix the errors above before building."
    echo ""
    echo "Common fixes:"
    echo "  1. npm install"
    echo "  2. Ensure google-services.json is present"
    echo "  3. Check package names match"
    echo "  4. Run: npx expo prebuild (if android folder missing)"
    echo ""
    exit 1
fi
