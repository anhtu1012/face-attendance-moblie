import { dtoDependent } from "@/models/auth/dtoUser";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomProfileInput from "./CustomProfileInput";
import { DatePickerInput } from "./DatePickerInput";

const formatDate = (value?: Date | string) => {
  if (!value) return "Chưa cập nhật";
  try {
    const dateObj = typeof value === "string" ? new Date(value) : value;
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("vi-VN");
    }
  } catch {}
  return "Chưa cập nhật";
};

type DependentCardProps = {
  dependent: dtoDependent;
  index: number;
  isEditingThis: boolean;
  onEdit: (dep: dtoDependent, index: number) => void;
  formikValues?: any;
  formikErrors?: any;
  setFieldValue?: (field: string, value: any) => void;
  onSubmit?: () => void;
  onDelete?: (dpId: string) => void;
};
export const DependentCard: React.FC<DependentCardProps> = React.memo(
  ({
    dependent,
    index,
    isEditingThis,
    onEdit,
    formikValues,
    formikErrors,
    setFieldValue,
    onSubmit,
    onDelete,
  }) => (
    <View style={styles.dependentCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {index + 1}. {dependent.dpFullName}
        </Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(dependent, index)}
          >
            <Feather name="edit" size={16} color="#3674B5" />
          </TouchableOpacity>
          {isEditingThis && (
            <TouchableOpacity style={styles.actionButton} onPress={onSubmit}>
              <Feather name="save" size={16} color="orange" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={() => onDelete?.(dependent.dpId)}>
            <Feather name="trash-2" size={16} color="#E53E3E" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContent}>
        {isEditingThis ? (
          <>
            <CustomProfileInput
              label="Họ và tên"
              value={formikValues?.dpFullName}
              onChangeText={(text: string) =>
                setFieldValue && setFieldValue("dpFullName", text)
              }
              icon="user"
              iconColor="#3674B5"
              error={formikErrors?.dpFullName as string}
              isEditing
            />
            <CustomProfileInput
              label="Số điện thoại"
              value={formikValues?.dpPhone}
              onChangeText={(text: string) =>
                setFieldValue && setFieldValue("dpPhone", text)
              }
              icon="phone"
              iconColor="#3674B5"
              error={formikErrors?.dpPhone as string}
              isEditing
            />
            <CustomProfileInput
              label="Mã số thuế"
              value={formikValues?.dpTaxCode}
              onChangeText={(text: string) =>
                setFieldValue && setFieldValue("dpTaxCode", text)
              }
              icon="credit-card"
              iconColor="#3674B5"
              error={formikErrors?.dpTaxCode as string}
              isEditing
            />
            <CustomProfileInput
              label="Số CMND/CCCD"
              value={formikValues?.dpCitizenIdentityCard}
              onChangeText={(text: string) =>
                setFieldValue && setFieldValue("dpCitizenIdentityCard", text)
              }
              icon="credit-card"
              iconColor="#3674B5"
              error={formikErrors?.dpCitizenIdentityCard as string}
              isEditing
            />
            <CustomProfileInput
              label="Nơi cấp"
              value={formikValues?.dpIssueAt}
              onChangeText={(text: string) =>
                setFieldValue && setFieldValue("dpIssueAt", text)
              }
              icon="map-pin"
              iconColor="#3674B5"
              error={formikErrors?.dpIssueAt as string}
              isEditing
            />
            <DatePickerInput
              label="Ngày cấp"
              value={formikValues?.dpIssueDate as Date}
              onChange={(date: Date) =>
                setFieldValue && setFieldValue("dpIssueDate", date)
              }
              icon="event"
              iconColor="#3674B5"
              isEditing
            />
            <DatePickerInput
              label="Ngày phụ thuộc"
              value={formikValues?.dpDependentDate as Date}
              onChange={(date: Date) =>
                setFieldValue && setFieldValue("dpDependentDate", date)
              }
              icon="schedule"
              iconColor="#3674B5"
              isEditing
            />
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ và tên:</Text>
              <Text style={styles.infoValue}>
                {dependent.dpFullName || "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>
                {dependent.dpPhone || "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã số thuế:</Text>
              <Text style={styles.infoValue}>
                {dependent.dpTaxCode || "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số CMND/CCCD:</Text>
              <Text style={styles.infoValue}>
                {dependent.dpCitizenIdentityCard || "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày cấp:</Text>
              <Text style={styles.infoValue}>
                {formatDate(dependent.dpIssueDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nơi cấp:</Text>
              <Text style={styles.infoValue}>
                {dependent.dpIssueAt || "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày phụ thuộc:</Text>
              <Text style={styles.infoValue}>
                {formatDate(dependent.dpDependentDate)}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  )
);
const styles = StyleSheet.create({
  dependentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
});
