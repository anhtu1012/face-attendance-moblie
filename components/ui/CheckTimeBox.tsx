import {
    CheckinStatus,
    CheckoutStatus,
    TimekeepingStatus,
} from "@/models/timesheet/timekeeping";
import { CheckCircle, CircleAlert, Clock, XCircle } from "lucide-react-native";
import React from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

interface CheckTimeBoxProps {
  type: "out" | "in";
  time: string;
  checkinStatus?: CheckinStatus | string;
  checkoutStatus?: CheckoutStatus | string;
  timekeepingStatus?: TimekeepingStatus | string;
}

const CheckTimeBox = ({
  type,
  time,
  checkinStatus,
  checkoutStatus,
  timekeepingStatus,
}: CheckTimeBoxProps) => {
  const isCheckinOntime = checkinStatus === CheckinStatus.START_ONTIME;
  const isCheckoutOntime = checkoutStatus === CheckoutStatus.END_ONTIME;

  const getStatusColor = () => {
    if (timekeepingStatus === TimekeepingStatus.NOT_WORK) return "#EF4444"; // Red
    
    if (type === "in") {
      if (!checkinStatus) return "#F59E0B"; // Orange/Yellow
      if (isCheckinOntime) return "#10B981"; // Green
      return "#EF4444"; // Red (Late)
    } else {
      if (!checkoutStatus) return "#F59E0B";
      if (isCheckoutOntime) return "#10B981";
      return "#EF4444"; // Early leave
    }
  };

  const getBackgroundColor = () => {
     if (timekeepingStatus === TimekeepingStatus.NOT_WORK) return "#FEF2F2";
     
     if (type === "in") {
       if (!checkinStatus) return "#FFFBEB";
       if (isCheckinOntime) return "#ECFDF5";
       return "#FEF2F2";
     } else {
       if (!checkoutStatus) return "#FFFBEB";
       if (isCheckoutOntime) return "#ECFDF5";
       return "#FEF2F2";
     }
  };

  const statusColor = getStatusColor();
  const backgroundColor = getBackgroundColor();

  const renderIcon = () => {
     if (timekeepingStatus === TimekeepingStatus.NOT_WORK) return <XCircle color={statusColor} size={18} />;
     
     if (type === "in") {
       if (!checkinStatus) return <CircleAlert color={statusColor} size={18} />;
       if (isCheckinOntime) return <CheckCircle color={statusColor} size={18} />;
       return <Clock color={statusColor} size={18} />;
     } else {
       if (!checkoutStatus) return <CircleAlert color={statusColor} size={18} />;
       if (isCheckoutOntime) return <CheckCircle color={statusColor} size={18} />;
       return <Clock color={statusColor} size={18} />;
     }
  };

  const renderStatusText = () => {
    if (timekeepingStatus === TimekeepingStatus.NOT_WORK) return "Không làm việc";

    if (type === "in") {
      if (!checkinStatus) return "Chưa vào";
      if (isCheckinOntime) return "Đúng giờ";
      return "Đến trễ";
    } else {
      if (!checkoutStatus) return "Chưa ra";
      if (isCheckoutOntime) return "Đúng giờ";
      return "Về sớm";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor, borderColor: statusColor + "40" }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: statusColor }]}>
          {type === "in" ? "Giờ vào" : "Giờ ra"}
        </Text>
        {renderIcon()}
      </View>
      
      <Text style={[styles.timeValue, { color: statusColor }]}>
        {time ? time : "--:--"}
      </Text>
      
      <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {renderStatusText()}
        </Text>
      </View>
    </View>
  );
};

export default CheckTimeBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    minHeight: 110,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  timeValue: {
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 4,
    letterSpacing: 0.5,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
