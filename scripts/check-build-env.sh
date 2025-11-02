#!/bin/bash

# Script to check if environment is ready for EAS build

echo "🔍 Checking EAS Build Prerequisites..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null
then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    ((errors++))
fi
echo ""

# Check npm
echo "2. Checking npm..."
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    ((errors++))
fi
echo ""

# Check EAS CLI
echo "3. Checking EAS CLI..."
if command -v eas &> /dev/null
then
    EAS_VERSION=$(eas --version)
    echo -e "${GREEN}✓${NC} EAS CLI installed: $EAS_VERSION"
else
    echo -e "${RED}✗${NC} EAS CLI not found"
    echo "   Install with: npm install -g eas-cli"
    ((errors++))
fi
echo ""

# Check if logged in to EAS
echo "4. Checking EAS authentication..."
if eas whoami &> /dev/null
then
    EAS_USER=$(eas whoami 2>&1)
    echo -e "${GREEN}✓${NC} Logged in as: $EAS_USER"
else
    echo -e "${RED}✗${NC} Not logged in to EAS"
    echo "   Login with: eas login"
    ((errors++))
fi
echo ""

# Check package.json
echo "5. Checking package.json..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json exists"
    
    # Check for critical native dependencies
    if grep -q "react-native-vision-camera" package.json; then
        echo -e "${GREEN}  ✓${NC} react-native-vision-camera found"
    fi
    
    if grep -q "react-native-vision-camera-face-detector" package.json; then
        echo -e "${GREEN}  ✓${NC} react-native-vision-camera-face-detector found"
    fi
else
    echo -e "${RED}✗${NC} package.json not found"
    ((errors++))
fi
echo ""

# Check app.json
echo "6. Checking app.json..."
if [ -f "app.json" ]; then
    echo -e "${GREEN}✓${NC} app.json exists"
    
    # Check for project ID
    if grep -q "projectId" app.json; then
        PROJECT_ID=$(grep -o '"projectId": "[^"]*"' app.json | cut -d'"' -f4)
        echo -e "${GREEN}  ✓${NC} Project ID: $PROJECT_ID"
    else
        echo -e "${RED}  ✗${NC} No project ID found in app.json"
        ((errors++))
    fi
    
    # Check for plugins
    if grep -q "react-native-vision-camera" app.json; then
        echo -e "${GREEN}  ✓${NC} vision-camera plugin configured"
    else
        echo -e "${YELLOW}  ⚠${NC} vision-camera plugin not found in app.json"
        ((warnings++))
    fi
else
    echo -e "${RED}✗${NC} app.json not found"
    ((errors++))
fi
echo ""

# Check eas.json
echo "7. Checking eas.json..."
if [ -f "eas.json" ]; then
    echo -e "${GREEN}✓${NC} eas.json exists"
    
    # Check for preview profile
    if grep -q '"preview"' eas.json; then
        echo -e "${GREEN}  ✓${NC} Preview profile configured"
    else
        echo -e "${RED}  ✗${NC} Preview profile not found"
        ((errors++))
    fi
else
    echo -e "${RED}✗${NC} eas.json not found"
    ((errors++))
fi
echo ""

# Check google-services.json (for Android)
echo "8. Checking google-services.json..."
if [ -f "google-services.json" ]; then
    echo -e "${GREEN}✓${NC} google-services.json exists"
else
    echo -e "${YELLOW}⚠${NC} google-services.json not found"
    echo "   This is required for Firebase/ML Kit features"
    echo "   Download from Firebase Console if needed"
    ((warnings++))
fi
echo ""

# Check node_modules
echo "9. Checking node_modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found"
    echo "   Run: npm install"
    ((warnings++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Ready to build! Run:"
    echo "  eas build --profile preview --platform android"
    echo ""
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ $warnings warning(s)${NC}"
    echo ""
    echo "You can proceed with the build, but fix warnings if issues occur."
    echo ""
    echo "To build, run:"
    echo "  eas build --profile preview --platform android"
    echo ""
    exit 0
else
    echo -e "${RED}✗ $errors error(s)${NC}"
    if [ $warnings -gt 0 ]; then
        echo -e "${YELLOW}⚠ $warnings warning(s)${NC}"
    fi
    echo ""
    echo "Please fix the errors above before building."
    echo ""
    exit 1
fi
