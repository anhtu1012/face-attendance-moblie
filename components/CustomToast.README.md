# Custom Toast Configuration Guide

## Overview
This project uses a customized `react-native-toast-message` with beautiful UI components.

## Features
- ✅ Success toasts with green theme
- ❌ Error toasts with red theme  
- ℹ️ Info toasts with blue theme
- ⚠️ Warning toasts with orange theme
- 🎨 Custom icons using Feather icons
- 🌈 Colored left borders
- 📱 Responsive design with shadows

## Usage

### Basic Usage
```typescript
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyComponent = () => {
  const insets = useSafeAreaInsets();

  // Success toast
  Toast.show({
    type: 'success',
    text1: 'Success!',
    text2: 'Your action was completed successfully',
    topOffset: insets.top + 10,
  });

  // Error toast
  Toast.show({
    type: 'error',
    text1: 'Error occurred',
    text2: 'Please try again later',
    topOffset: insets.top + 10,
  });

  // Info toast
  Toast.show({
    type: 'info',
    text1: 'Did you know?',
    text2: 'You can customize these messages',
    topOffset: insets.top + 10,
  });

  // Warning toast
  Toast.show({
    type: 'warning',
    text1: 'Warning!',
    text2: 'Please review your input',
    topOffset: insets.top + 10,
  });
};
```

### Advanced Options
```typescript
Toast.show({
  type: 'success',
  text1: 'Title',
  text2: 'Description (optional)',
  topOffset: insets.top + 10,        // Position from top
  position: 'top',                   // 'top' | 'bottom'
  visibilityTime: 4000,              // Duration in ms (default: 4000)
  autoHide: true,                    // Auto hide (default: true)
  onPress: () => console.log('Pressed'), // On tap callback
  onShow: () => console.log('Shown'),    // On show callback
  onHide: () => console.log('Hidden'),   // On hide callback
});
```

## Customization

### Modify Colors
Edit `/components/CustomToast.tsx`:

```typescript
// Change success color
successContainer: {
  backgroundColor: "#ECFDF5",      // Background
  borderLeftColor: "#10B981",      // Border color
},

// Change icon color in component
<Feather name="check-circle" size={24} color="#10B981" />
```

### Add New Toast Type
Add to `toastConfig` in `/components/CustomToast.tsx`:

```typescript
export const toastConfig = {
  // ... existing types
  
  // Custom type
  custom: (props: any) => (
    <View style={[styles.container, styles.customContainer]}>
      <View style={styles.iconContainer}>
        <Feather name="star" size={24} color="#8B5CF6" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
      </View>
    </View>
  ),
};

// Add corresponding style
customContainer: {
  backgroundColor: "#F5F3FF",
  borderLeftWidth: 4,
  borderLeftColor: "#8B5CF6",
},
```

### Change Icon Size
```typescript
<Feather name="check-circle" size={28} color="#10B981" />
```

### Modify Container Style
```typescript
container: {
  width: "90%",              // Width
  paddingHorizontal: 16,     // Horizontal padding
  paddingVertical: 14,       // Vertical padding
  borderRadius: 12,          // Corner radius
  // Add more styles as needed
},
```

### Change Text Styles
```typescript
title: {
  fontSize: 16,          // Title size
  fontWeight: "600",     // Title weight
  color: "#1F2937",      // Title color
},
message: {
  fontSize: 14,          // Message size
  color: "#6B7280",      // Message color
},
```

## Color Palette Used

### Success (Green)
- Background: `#ECFDF5`
- Border: `#10B981`
- Icon: `#10B981`

### Error (Red)
- Background: `#FEF2F2`
- Border: `#EF4444`
- Icon: `#EF4444`

### Info (Blue)
- Background: `#EFF6FF`
- Border: `#3B82F6`
- Icon: `#3B82F6`

### Warning (Orange)
- Background: `#FFFBEB`
- Border: `#F59E0B`
- Icon: `#F59E0B`

## Examples in Project

See usage examples in:
- `/app/login.tsx` - Login success/error messages
- Add more examples as you use them in other components

## Tips
1. Always use `insets.top + 10` for proper positioning under status bar
2. Keep `text1` short (main message)
3. Use `text2` for additional details
4. Consider using `visibilityTime` for important messages (increase duration)
5. Toast automatically handles safe area on Android/iOS
