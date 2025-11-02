# 📱 Quick Reference: Responsive Styling

## Before & After Comparison

### ❌ Before (Fixed Values)
```typescript
export const FaceGuide = {
  width: 40,           // Fixed pixels
  height: 40,
  top: 180,
  bottom: -25,
  horizontal: 40,
};

export const styles = StyleSheet.create({
  faceGuide: {
    width: 300,        // Fixed pixels
    height: 380,
  },
});
```

**Problems:**
- Too large on small phones
- Too small on tablets
- Doesn't adapt to orientation changes

### ✅ After (Percentage-Based)
```typescript
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const FaceGuide = {
  width: SCREEN_WIDTH * 0.11,      // 11% of screen width
  height: SCREEN_WIDTH * 0.11,     // Square based on width
  top: SCREEN_HEIGHT * 0.23,       // 23% from top
  bottom: -SCREEN_HEIGHT * 0.03,   // -3% from bottom
  horizontal: SCREEN_WIDTH * 0.1,  // 10% margin
};

export const styles = StyleSheet.create({
  faceGuide: {
    width: SCREEN_WIDTH * 0.8,     // 80% of screen
    height: SCREEN_HEIGHT * 0.5,   // 50% of screen
  },
});
```

**Benefits:**
- ✅ Adapts to all screen sizes
- ✅ Consistent proportions
- ✅ Works on tablets and phones

## 📐 Helper Functions

```typescript
// Width-based percentage
const wp = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;

// Height-based percentage
const hp = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;

// Usage
width: wp(80),    // 80% of screen width
height: hp(50),   // 50% of screen height
top: hp(20),      // 20% from top
margin: wp(5),    // 5% margin
```

## 📊 Responsive Values Table

| Element | Percentage | iPhone SE | iPhone 14 | iPad |
|---------|-----------|-----------|-----------|------|
| Corner Width | 11% width | 41px | 47px | 84px |
| Corner Height | 11% width | 41px | 47px | 84px |
| Top Position | 23% height | 153px | 194px | 235px |
| Guide Width | 80% width | 300px | 348px | 614px |
| Guide Height | 50% height | 334px | 422px | 512px |

## 🎯 When to Use What

### Use Width-Based (`SCREEN_WIDTH * %`)
- ✅ Horizontal positioning (left, right)
- ✅ Widths and horizontal margins
- ✅ Square elements (use same value for width & height)
- ✅ Border radius

```typescript
width: SCREEN_WIDTH * 0.8,        // Element width
marginHorizontal: SCREEN_WIDTH * 0.1,  // Side margins
borderRadius: SCREEN_WIDTH * 0.05,     // Rounded corners
```

### Use Height-Based (`SCREEN_HEIGHT * %`)
- ✅ Vertical positioning (top, bottom)
- ✅ Heights and vertical margins
- ✅ Spacing between elements vertically

```typescript
height: SCREEN_HEIGHT * 0.5,      // Element height
marginTop: SCREEN_HEIGHT * 0.1,   // Top margin
top: SCREEN_HEIGHT * 0.2,         // Position from top
```

## 🔄 For Dynamic Updates (Orientation Changes)

### Option 1: Use Hook
```typescript
import { useFaceGuideDimensions } from '@/hooks/useResponsiveDimensions';

const MyComponent = () => {
  const dimensions = useFaceGuideDimensions();
  
  return (
    <View style={{ width: dimensions.guideWidth }}>
      {/* Automatically updates on rotation */}
    </View>
  );
};
```

### Option 2: Listen to Events
```typescript
useEffect(() => {
  const subscription = Dimensions.addEventListener('change', () => {
    // Update state or recalculate
  });
  return () => subscription?.remove();
}, []);
```

## 💡 Common Patterns

### Pattern 1: Responsive Container
```typescript
<View style={{
  width: SCREEN_WIDTH * 0.9,      // 90% width
  height: SCREEN_HEIGHT * 0.6,    // 60% height
  marginHorizontal: SCREEN_WIDTH * 0.05,  // Center with 5% margin
}}>
```

### Pattern 2: Responsive Text
```typescript
<Text style={{
  fontSize: SCREEN_WIDTH * 0.045,  // ~4.5% of width
  marginTop: SCREEN_HEIGHT * 0.02, // 2% spacing
}}>
```

### Pattern 3: Responsive Corners
```typescript
const cornerSize = SCREEN_WIDTH * 0.1;  // 10% of width

<View style={{
  width: cornerSize,
  height: cornerSize,
  top: SCREEN_HEIGHT * 0.25,
  left: SCREEN_WIDTH * 0.1,
}}>
```

## 🎨 Device-Specific Adjustments

```typescript
const { width } = Dimensions.get('window');

const isSmallDevice = width < 375;
const isTablet = width >= 768;

const cornerSize = isSmallDevice 
  ? width * 0.1   // 10% on small devices
  : isTablet 
    ? width * 0.08  // 8% on tablets
    : width * 0.11; // 11% on normal phones
```

## 🔧 Testing on Different Sizes

```bash
# iOS Simulators
- iPhone SE (375 x 667)
- iPhone 14 (390 x 844)
- iPhone 14 Pro Max (430 x 932)
- iPad (768 x 1024)

# Android Emulators
- Small (360 x 640)
- Medium (411 x 891)
- Large (480 x 1080)
- Tablet (800 x 1280)
```

## 📝 Conversion Examples

```typescript
// Fixed to Responsive Conversion

// Width: 300px on 390px wide screen = 300/390 ≈ 0.77 (77%)
width: 300  →  width: SCREEN_WIDTH * 0.77

// Height: 400px on 844px tall screen = 400/844 ≈ 0.47 (47%)
height: 400  →  height: SCREEN_HEIGHT * 0.47

// Top: 100px on 844px tall screen = 100/844 ≈ 0.12 (12%)
top: 100  →  top: SCREEN_HEIGHT * 0.12

// Margin: 20px on 390px wide screen = 20/390 ≈ 0.05 (5%)
margin: 20  →  margin: SCREEN_WIDTH * 0.05
```

## 🚀 Quick Setup

```typescript
// 1. Import Dimensions
import { Dimensions, StyleSheet } from "react-native";

// 2. Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 3. Use percentages
const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,   // 90% width
    height: SCREEN_HEIGHT * 0.7, // 70% height
  },
});
```

## 📚 Learn More

- **Full Guide**: `RESPONSIVE_STYLING_GUIDE.md`
- **Advanced Version**: `FaceGuideoverlay.styles.responsive.ts`
- **React Hook**: `hooks/useResponsiveDimensions.ts`
