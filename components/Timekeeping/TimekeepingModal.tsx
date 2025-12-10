import { useGetDetailTimekeepingData } from "@/hooks/useGetDetailTimekeepingData";
import { TimekeepingStatus } from "@/models/timesheet/timekeeping";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import CheckTimeBox from "../ui/CheckTimeBox";
import NotWorkNotification from "../ui/NotWorkNotification";
import TimeDetailBox from "./TimeDetailBox";
import TimesheetModalHeader from "./TimesheetModalHeader";
import TimesheetTotalHourBox from "./TimesheetTotalHourBox";

interface Props {
  onClose: () => void;
  selectedTimekeepingId: number;
  visible: boolean;
  offDateString: string;
}

export default function TimekeepingModal({
  visible,
  onClose,
  selectedTimekeepingId,
  offDateString,
}: Props) {
  if (selectedTimekeepingId === 0)
    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={onClose}
        visible={visible}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TimesheetModalHeader
              dateString={offDateString}
              onClose={onClose}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <NotWorkNotification />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  const { detailTimekeepingData: timekeeping } = useGetDetailTimekeepingData({
    timekeepingId: selectedTimekeepingId.toString(),
  });

  const dateString = new Date(timekeeping?.date ?? "").toLocaleDateString(
    "vi-VN"
  );
  return (
    <Modal
      animationType="slide"
      transparent
      onRequestClose={onClose}
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TimesheetModalHeader dateString={dateString} onClose={onClose} />
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.row}>
              <CheckTimeBox
                type="in"
                time={timekeeping?.checkinTime ?? ""}
                checkinStatus={timekeeping?.checkInStatus ?? ""}
                timekeepingStatus={timekeeping?.status ?? ""}
              />
              <CheckTimeBox
                type="out"
                time={timekeeping?.checkOutTime ?? ""}
                checkoutStatus={timekeeping?.checkOutStatus ?? ""}
                timekeepingStatus={timekeeping?.status ?? ""}
              />
              <TimesheetTotalHourBox
                totalWorkHour={timekeeping?.totalWorkHour ?? 0}
                totalTimekeepingNumber={
                  timekeeping?.totalTimekeepingNumber ?? 0
                }
              />
            </View>
            {timekeeping?.status === TimekeepingStatus.FORGET_LOG && (
              <View style={styles.forgetLogContainer}>
                <Text style={styles.forgetLogText}>
                  Bạn đã quên check out vào ngày này!
                </Text>
              </View>
            )}
            {!timekeeping?.isFromOt && (
              <TimeDetailBox
                title="Ca làm việc"
                data={[
                  {
                    label: "Thời gian",
                    value: `${timekeeping?.shiftInfor?.shiftStartTime} - ${timekeeping?.shiftInfor?.shiftEndTime}`,
                  },
                  {
                    label: "Số giờ",
                    value: timekeeping?.shiftInfor?.shiftWorkHour ?? "--",
                  },
                  {
                    label: "Số công",
                    value:
                      timekeeping?.shiftInfor?.shiftTimekeepingNumber ?? "--",
                  },
                ]}
              />
            )}

            {timekeeping?.otInfor?.otWorkHour && (
              <TimeDetailBox
                title="Làm thêm giờ"
                data={[
                  {
                    label: "Thời gian",
                    value: `${timekeeping?.otInfor?.otStartTime} - ${timekeeping?.otInfor?.otEndTime}`,
                  },
                  {
                    label: "Số giờ",
                    value: timekeeping?.otInfor?.otWorkHour ?? "--",
                  },
                  {
                    label: "Số công",
                    value: timekeeping?.otInfor?.otTimekeepingNumber ?? "--",
                  },
                ]}
              />
            )}
            {timekeeping?.status !== TimekeepingStatus.NOT_WORK &&
              !timekeeping?.isFromOt && (
                <TimeDetailBox
                  title="Chốt gương mặt trong ngày"
                  data={[
                    {
                      label: `${
                        timekeeping?.checkinTime ?? "--"
                      }, ${dateString}`,
                      value: timekeeping?.checkInStatus ?? "--",
                    },
                    {
                      label: timekeeping?.checkOutTime
                        ? `${timekeeping?.checkOutTime}, ${dateString}`
                        : "Chưa check out",
                      value: timekeeping?.checkOutStatus ?? "",
                    },
                  ]}
                />
              )}
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
  forgetLogContainer: {
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  forgetLogText: {
    fontSize: 14,
    color: "#DC3545",
    fontStyle: "italic",
  },
});
