import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export const CustomClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondHandRotation = (seconds / 60) * 360;
  const minuteHandRotation = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourHandRotation = (hours / 12) * 360 + (minutes / 60) * 30;

  // Create hour markers
  const markers = Array.from({ length: 12 }).map((_, i) => (
    <View
      key={`marker-${i}`}
      style={[
        styles.markerContainer,
        { transform: [{ rotate: `${i * 30}deg` }] },
      ]}
    >
      <View
        style={[
          styles.marker,
          i % 3 === 0 ? styles.largeMarker : styles.smallMarker,
        ]}
      />
    </View>
  ));

  return (
    <View style={styles.container}>
      {/* Clock face layers */}
      <View style={styles.outerFace} />
      <View style={styles.innerFace} />

      {/* Markers */}
      <View style={styles.markersContainer}>{markers}</View>

      {/* Hour Hand */}
      <View
        style={[
          styles.hourHand,
          { transform: [{ rotate: `${hourHandRotation}deg` }] },
        ]}
      />

      {/* Minute Hand */}
      <View
        style={[
          styles.minuteHand,
          { transform: [{ rotate: `${minuteHandRotation}deg` }] },
        ]}
      />

      {/* Second Hand */}
      <View
        style={[
          styles.secondHand,
          { transform: [{ rotate: `${secondHandRotation}deg` }] },
        ]}
      />

      {/* Center pivot */}
      <View style={styles.centerPivot} />
    </View>
  );
};

const CLOCK_SIZE = 172;
const CENTER = CLOCK_SIZE / 2;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  outerFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: CLOCK_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  innerFace: {
    position: "absolute",
    width: "95%",
    height: "95%",
    backgroundColor: "rgba(12, 74, 110, 0.2)", // sky-900/20
    borderRadius: (CLOCK_SIZE * 0.95) / 2,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  markersContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  marker: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    position: "absolute",
    top: 5,
    left: CENTER - 2,
    borderRadius: 2,
  },
  largeMarker: {
    width: 4,
    height: 20,
  },
  smallMarker: {
    width: 2,
    height: 12,
  },
  hourHand: {
    position: "absolute",
    width: 6,
    height: 56, // 3.5rem
    backgroundColor: "#ffffff",
    borderRadius: 3,
    bottom: CENTER,
    left: CENTER - 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    transformOrigin: "bottom",
  },
  minuteHand: {
    position: "absolute",
    width: 4,
    height: 80, // 5rem
    backgroundColor: "#ffffff",
    borderRadius: 2,
    bottom: CENTER,
    left: CENTER - 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    transformOrigin: "bottom",
  },
  secondHand: {
    position: "absolute",
    width: 2,
    height: 80, // 5.5rem
    backgroundColor: "#7dd3fc", // sky-300
    bottom: CENTER,
    left: CENTER - 1,
    transformOrigin: "bottom",
  },
  centerPivot: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: "#7dd3fc", // sky-300
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});
