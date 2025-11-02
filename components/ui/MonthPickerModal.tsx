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

interface MonthPickerModalProps {
  showMonthPicker: boolean;
  setShowMonthPicker: (visible: boolean) => void;
  selectedYear: number;
  selectedMonth: number;
  handleMonthSelect: (year: number, month: number) => void;
  currentDate: Date;
}

const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  showMonthPicker,
  setShowMonthPicker,
  selectedYear,
  selectedMonth,
  handleMonthSelect,
  currentDate,
}) => {
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);

  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  // Danh sách 21 năm - từ nhỏ đến lớn (giống tháng)
  const years = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    return Array.from({ length: 21 }, (_, i) => currentYear - 20 + i);
  }, [currentDate]);

  // Danh sách tháng 1 -> 12
  const monthNames = [
    { name: "Tháng 1", short: "T1" },
    { name: "Tháng 2", short: "T2" },
    { name: "Tháng 3", short: "T3" },
    { name: "Tháng 4", short: "T4" },
    { name: "Tháng 5", short: "T5" },
    { name: "Tháng 6", short: "T6" },
    { name: "Tháng 7", short: "T7" },
    { name: "Tháng 8", short: "T8" },
    { name: "Tháng 9", short: "T9" },
    { name: "Tháng 10", short: "T10" },
    { name: "Tháng 11", short: "T11" },
    { name: "Tháng 12", short: "T12" },
  ];

  const handleConfirm = () => {
    handleMonthSelect(tempYear, tempMonth);
    setShowMonthPicker(false);
  };

  const handleCancel = () => {
    setTempYear(selectedYear);
    setTempMonth(selectedMonth);
    setShowMonthPicker(false);
  };

  // Scroll to selected item when modal opens
  useEffect(() => {
    if (showMonthPicker) {
      setTimeout(() => {
        // Scroll to selected month (index = month - 1)
        monthScrollRef.current?.scrollTo({
          y: (tempMonth - 1) * 50,
          animated: false, // No animation for instant display
        });

        // Scroll to selected year
        const yearIndex = years.indexOf(tempYear);
        if (yearIndex !== -1) {
          yearScrollRef.current?.scrollTo({
            y: yearIndex * 50,
            animated: false, // No animation for instant display
          });
        }
      }, 100);
    }
  }, [showMonthPicker]);

  return (
    <Modal
      visible={showMonthPicker}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="calendar-month"
              size={26}
              color="#3674B5"
            />
            <Text style={styles.headerTitle}>Chọn tháng & năm</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Feather name="x" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Body - Wheel Picker Style */}
          <View style={styles.body}>
            {/* Month Column */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Tháng</Text>
              <View style={styles.pickerWrapper}>
                {/* Selection Indicator for Month */}
                <View style={styles.selectionIndicator} />
                <View style={styles.pickerContainer}>
                  <ScrollView
                    ref={monthScrollRef}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={50} // Height of each item
                    decelerationRate="fast"
                    contentContainerStyle={{
                      paddingVertical: 100, // (250 - 50) / 2 = center first/last item
                    }}
                    onScroll={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 50);
                      const newMonth = Math.max(1, Math.min(12, index + 1));
                      if (newMonth !== tempMonth) {
                        setTempMonth(newMonth);
                      }
                    }}
                    scrollEventThrottle={16}
                  >
                    {monthNames.map((month, index) => {
                      const monthValue = index + 1;
                      const isSelected = tempMonth === monthValue;
                      return (
                        <View
                          key={monthValue}
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
                            {month.short}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>

            {/* Year Column */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Năm</Text>
              <View style={styles.pickerWrapper}>
                {/* Selection Indicator for Year */}
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

export default MonthPickerModal;

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
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    overflow: "hidden", // Prevent content overflow
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  selectionIndicator: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 50,
    marginTop: -25, // Center it
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#3674B5",
    backgroundColor: "rgba(54, 116, 181, 0.05)",
    zIndex: 1,
    pointerEvents: "none",
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    textAlign: "center",
  },
  wheelItem: {
    height: 50, // Fixed height for snap
    justifyContent: "center",
    alignItems: "center",
  },
  wheelItemActive: {
    // Active item (in center)
  },
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
