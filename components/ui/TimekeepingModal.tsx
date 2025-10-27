import { TimekeepingDetail } from "@/models/timesheet/timekeeping";
import { Clock, X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CheckTimeBox from "./CheckTimeBox";
import TimeDetailBox from "./TimeDetailBox";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedTimekeepingId: number;
}

export default function TimekeepingModal({
  visible,
  onClose,
  selectedTimekeepingId,
}: Props) {
  const timekeeping = fakeTimekeepingDetails.find(
    (timekeepingDetail) =>
      timekeepingDetail.timeKeepingId === selectedTimekeepingId
  );

  const date = new Date(timekeeping?.date ?? "").toLocaleDateString("vi-VN");
  const dateString = new Date(timekeeping?.date ?? "").toLocaleDateString(
    "vi-VN"
  );
  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={{ width: 10, height: 10 }} />
            <Text style={styles.headerTitle}>Chấm công, ngày {dateString}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color="#444" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {/* GIỜ VÀO / GIỜ RA */}
            <View style={styles.row}>
              <CheckTimeBox
                type="in"
                time={timekeeping?.checkinTime ?? "--:--"}
                checkinStatus={timekeeping?.checkinStatus ?? "ontime"}
                checkoutStatus={timekeeping?.checkoutStatus ?? "ontime"}
              />
              <CheckTimeBox
                type="out"
                time={timekeeping?.checkoutTime ?? "--:--"}
                checkinStatus={timekeeping?.checkinStatus ?? "ontime"}
                checkoutStatus={timekeeping?.checkoutStatus ?? "ontime"}
              />
              {/* TỔNG GIỜ */}
              <View style={[styles.cardFull, { backgroundColor: "#F5EEFF" }]}>
                <View style={styles.cardRow}>
                  <Clock color="#7E57C2" size={18} />
                  <Text style={styles.totalHourText}>
                    {timekeeping?.totalWorkHour?.toFixed(1) ?? "0"} giờ
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#7E57C2",
                    height: 5,
                    borderRadius: 5,
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 6,
                  }}
                />
                <Text style={styles.totalHourValue}>
                  {timekeeping?.totalTimekeepingNumber ?? 0}
                </Text>
              </View>
            </View>

            {/* CA LÀM VIỆC */}
            <TimeDetailBox
              title="Ca làm việc"
              data={[
                {
                  label: "Thời gian",
                  value: `${timekeeping?.shiftInfo?.shiftStartTime} - ${timekeeping?.shiftInfo?.shiftEndTime}`,
                },
                {
                  label: "Số giờ",
                  value: timekeeping?.shiftInfo?.shiftWorkHour ?? "--",
                },
                {
                  label: "Số công",
                  value: timekeeping?.shiftInfo?.shiftTimekeepingNumber ?? "--",
                },
              ]}
            />

            {/* OT SECTION */}
            {timekeeping?.otInfo && (
              <TimeDetailBox
                title="Làm thêm giờ"
                data={[
                  {
                    label: "Thời gian",
                    value: `${timekeeping?.otInfo?.otStartTime} - ${timekeeping?.otInfo?.otEndTime}`,
                  },
                  {
                    label: "Số giờ",
                    value: timekeeping?.otInfo?.otWorkHour ?? "--",
                  },
                  {
                    label: "Số công",
                    value: timekeeping?.otInfo?.otTimekeepingNumber ?? "--",
                  },
                ]}
              />
            )}
            <TimeDetailBox
              title="Chốt gương mặt trong ngày"
              data={[
                {
                  label: `Giờ vào: ${
                    timekeeping?.checkinTime ?? "--"
                  }, ${dateString}`,
                  value: timekeeping?.checkinStatus ?? "--",
                },
                {
                  label: `Giờ ra: ${
                    timekeeping?.checkoutTime ?? "--"
                  }, ${dateString}`,
                  value: timekeeping?.checkoutStatus ?? "--",
                },
              ]}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    paddingVertical: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
  },
  cardLabel: {
    fontSize: 13,
    color: "#555",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  cardNote: {
    fontSize: 12,
    color: "#2ECC71",
  },
  cardFull: {
    borderRadius: 12,
    padding: 14,
  },
  totalHourText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
    color: "#7E57C2",
  },
  totalHourValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7E57C2",
    textAlign: "center",
  },
  shiftBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  shiftTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 8,
    color: "#333",
  },
  shiftRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  shiftLabel: {
    fontSize: 13,
    color: "#666",
  },
  shiftValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
});
const fakeTimekeepingDetails: TimekeepingDetail[] = [
  {
    timeKeepingId: 1,
    userId: 42,
    date: "2025-10-26",
    checkinTime: "",
    checkoutTime: "",
    totalWorkHour: 0,
    totalTimekeepingNumber: 0,
    shiftInfo: {
      shiftStartTime: "08:00",
      shiftEndTime: "17:00",
      shiftWorkHour: 8,
      shiftTimekeepingNumber: 0,
    },
    checkinStatus: "ontime",
    checkoutStatus: "early",
  },
  {
    timeKeepingId: 2,
    userId: 42,
    date: "2025-10-25",
    checkinTime: "08:00",
    checkoutTime: "12:00",
    totalWorkHour: 8,
    totalTimekeepingNumber: 1.0,
    shiftInfo: {
      shiftStartTime: "08:00",
      shiftEndTime: "17:00",
      shiftWorkHour: 8,
      shiftTimekeepingNumber: 1.0,
    },
    checkinStatus: "ontime",
    checkoutStatus: "early",
  },
  {
    timeKeepingId: 3,
    userId: 42,
    date: "2025-10-24",
    checkinTime: "07:30",
    checkoutTime: "18:00",
    totalWorkHour: 10.0,
    shiftInfo: {
      shiftStartTime: "08:00",
      shiftEndTime: "17:00",
      shiftWorkHour: 8,
      shiftTimekeepingNumber: 1.0,
    },
    totalTimekeepingNumber: 1.0,
    otInfo: {
      otStartTime: "17:00",
      otEndTime: "18:00",
      otWorkHour: 2.0,
      otTimekeepingNumber: 0.5,
    },
    checkinStatus: "ontime",
    checkoutStatus: "ontime",
  },
  {
    timeKeepingId: 4,
    userId: 42,
    date: "2025-10-23",
    checkinTime: "08:00",
    checkoutTime: "17:00",
    totalWorkHour: 8,
    shiftInfo: {
      shiftStartTime: "08:00",
      shiftEndTime: "17:00",
      shiftWorkHour: 8,
      shiftTimekeepingNumber: 1.0,
    },
    totalTimekeepingNumber: 1.0,
    checkinStatus: "ontime",
    checkoutStatus: "ontime",
  },
  {
    timeKeepingId: 5,
    userId: 42,
    date: "2025-10-22",
    checkinTime: "08:00",
    checkoutTime: "17:00",
    totalWorkHour: 8,
    shiftInfo: {
      shiftStartTime: "08:00",
      shiftEndTime: "17:00",
      shiftWorkHour: 8,
      shiftTimekeepingNumber: 1.0,
    },
    totalTimekeepingNumber: 1.0,
    checkinStatus: "ontime",
    checkoutStatus: "ontime",
  },
  {
    timeKeepingId: 6,
    userId: 42,
    date: "2025-10-21",
    checkinTime: "09:15",
    checkoutTime: "17:00",
    totalWorkHour: 8,
    shiftInfo: {
      shiftStartTime: "08:00",
      shiftEndTime: "17:00",
      shiftWorkHour: 8,
      shiftTimekeepingNumber: 0.97,
    },
    totalTimekeepingNumber: 0.97,
    checkinStatus: "late",
    checkoutStatus: "early",
  },
  {
    timeKeepingId: 7,
    userId: 42,
    date: "2025-10-20",
    checkinTime: "08:30",
    checkoutTime: "17:30",
    totalWorkHour: 8.5,
    shiftInfo: {
      shiftStartTime: "08:00",
      shiftEndTime: "17:00",
      shiftWorkHour: 8,
      shiftTimekeepingNumber: 1.0,
    },
    totalTimekeepingNumber: 1.5,
    otInfo: {
      otStartTime: "17:00",
      otEndTime: "17:30",
      otWorkHour: 0.5,
      otTimekeepingNumber: 0.5,
    },
    checkinStatus: "late",
    checkoutStatus: "early",
  },
  {
    timeKeepingId: 8,
    userId: 42,
    date: "2025-10-19",
    checkinTime: "08:00",
    checkoutTime: "17:00",
    totalWorkHour: 8,
    shiftInfo: {
      shiftStartTime: "08:00",
      shiftEndTime: "17:00",
      shiftWorkHour: 8,
      shiftTimekeepingNumber: 1.0,
    },
    totalTimekeepingNumber: 1.0,
    checkinStatus: "ontime",
    checkoutStatus: "early",
  },
];
