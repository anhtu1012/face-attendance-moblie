import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface YearPickerModalProps {
  showYearPicker: boolean;
  setShowYearPicker: (visible: boolean) => void;
  selectedYear: number;
  handleYearSelect: (year: number) => void;
  currentDate: Date;
}

const YearPickerModal: React.FC<YearPickerModalProps> = ({
  showYearPicker,
  setShowYearPicker,
  selectedYear,
  handleYearSelect,
  currentDate,
}) => {
  const [tempYear, setTempYear] = useState(selectedYear);

  const yearScrollRef = useRef<ScrollView>(null);

  // List of years (2020 to current year + 1)
  const years = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const startYear = 2020;
    const endYear = currentYear + 1;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
  }, [currentDate]);

  const handleConfirm = () => {
    handleYearSelect(tempYear);
    setShowYearPicker(false);
  };

  const handleCancel = () => {
    setTempYear(selectedYear);
    setShowYearPicker(false);
  };

  // Scroll to selected year when modal opens
  useEffect(() => {
    if (showYearPicker) {
      setTimeout(() => {
        const yearIndex = years.indexOf(tempYear);
        if (yearIndex !== -1) {
          yearScrollRef.current?.scrollTo({
            y: yearIndex * 50,
            animated: false,
          });
        }
      }, 100);
    }
  }, [showYearPicker]);

  return (
    <Modal
      visible={showYearPicker}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={26}
              color="#3674B5"
            />
            <Text style={styles.headerTitle}>Chọn năm</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Feather name="x" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Body - Wheel Picker Style */}
          <View style={styles.body}>
            <View style={styles.pickerWrapper}>
              {/* Selection Indicator */}
              <View style={styles.selectionIndicator} />
              <View style={styles.pickerContainer}>
                <ScrollView
                  ref={yearScrollRef}
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  contentContainerStyle={{
                    paddingVertical: 100,
                  }}
                  onScroll={(e) => {
                    const offsetY = e.nativeEvent.contentOffset.y;
                    const index = Math.round(offsetY / 50);
                    const newYear =
                      years[Math.max(0, Math.min(years.length - 1, index))];
                    if (newYear && newYear !== tempYear) {
                      setTempYear(newYear);
                    }
                  }}
                  scrollEventThrottle={16}
                >
                  {years.map((year) => {
                    const isSelected = tempYear === year;
                    return (
                      <View
                        key={year}
                        style={[
                          styles.wheelItem,
                          isSelected && styles.wheelItemActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.wheelText,
                            isSelected && styles.wheelTextActive,
                          ]}
                        >
                          {year}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Feather name="check" size={16} color="#FFF" />
              <Text style={styles.confirmText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default YearPickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "80%",
    maxWidth: 350,
    maxHeight: "70%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },
  body: {
    padding: 10,
  },
  selectionIndicator: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 50,
    marginTop: -25,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#3674B5",
    backgroundColor: "rgba(54, 116, 181, 0.05)",
    zIndex: 1,
    pointerEvents: "none",
  },
  pickerWrapper: {
    position: "relative",
    height: 250,
  },
  pickerContainer: {
    height: 250,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  wheelItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  wheelItemActive: {},
  wheelText: {
    fontSize: 18,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  wheelTextActive: {
    fontSize: 22,
    color: "#3674B5",
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#3674B5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#3674B5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  cancelText: {
    color: "#6B7280",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
