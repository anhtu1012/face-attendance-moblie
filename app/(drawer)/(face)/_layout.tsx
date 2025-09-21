import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const FaceLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="face-register"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="camera"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default FaceLayout;
