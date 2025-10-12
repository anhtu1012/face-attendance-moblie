import { dtoDependent } from "../../models/auth/dtoUser";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DependentCardProps {
  dependent: dtoDependent;
  index: number;
  isEditing?: boolean;
  onEdit?: (dependent: dtoDependent) => void;
  onDelete?: (dpUserId: string) => void;
  onSave?: (dependent: dtoDependent) => void;
  onCancel?: () => void;
  showActions?: boolean;
}

const DependentCard: React.FC<DependentCardProps> = ({
  dependent,
  index,
  isEditing = false,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  showActions = true,
}) => {
  const [editData, setEditData] = useState<dtoDependent>(dependent);

  const formatDate = (date: Date | string) => {
    if (!date) return "";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toISOString().split("T")[0]; // Format for date input
    } catch (error) {
      return "";
    }
  };

  const formatDisplayDate = (date: Date | string) => {
    if (!date) return "Chưa cập nhật";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("vi-VN");
    } catch (error) {
      return "Chưa cập nhật";
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editData);
    }
  };

  const handleCancel = () => {
    setEditData(dependent);
    if (onCancel) {
      onCancel();
    }
  };

  const InfoField = ({
    icon,
    label,
    value,
    onChangeText,
    keyboardType = "default",
    multiline = false,
  }: {
    icon: string;
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
    multiline?: boolean;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoItem}>
        <Feather name={icon as any} size={14} color="#666" />
        <Text style={styles.infoLabel}>{label}:</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            multiline={multiline}
            placeholder={`Nhập ${label.toLowerCase()}`}
          />
        ) : (
          <Text style={styles.infoValue}>{value || "Chưa cập nhật"}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <View style={styles.headerInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editData.dpFullName}
                onChangeText={(text) =>
                  setEditData({ ...editData, dpFullName: text })
                }
                placeholder="Nhập họ tên"
              />
            ) : (
              <Text style={styles.fullName}>{dependent.dpFullName}</Text>
            )}
            <Text style={styles.userId}>ID: {dependent.dpUserId}</Text>
          </View>
        </View>

        {showActions && (
          <View style={styles.actions}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Feather name="check" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Feather name="x" size={16} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {onEdit && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onEdit(dependent)}
                  >
                    <Feather name="edit-3" size={16} color="#3674B5" />
                  </TouchableOpacity>
                )}
                {onDelete && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => onDelete(dependent.dpUserId)}
                  >
                    <Feather name="trash-2" size={16} color="#E53E3E" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <InfoField
          icon="phone"
          label="SĐT"
          value={isEditing ? editData.dpPhone : dependent.dpPhone}
          onChangeText={(text) => setEditData({ ...editData, dpPhone: text })}
          keyboardType="phone-pad"
        />

        <InfoField
          icon="credit-card"
          label="Mã số thuế"
          value={isEditing ? editData.dpTaxCode : dependent.dpTaxCode}
          onChangeText={(text) => setEditData({ ...editData, dpTaxCode: text })}
        />

        <InfoField
          icon="card-gift"
          label="CCCD/CMND"
          value={
            isEditing
              ? editData.dpCitizenIdentityCard
              : dependent.dpCitizenIdentityCard
          }
          onChangeText={(text) =>
            setEditData({ ...editData, dpCitizenIdentityCard: text })
          }
        />

        <InfoField
          icon="calendar"
          label="Ngày cấp"
          value={
            isEditing
              ? formatDate(editData.dpIssueDate)
              : formatDisplayDate(dependent.dpIssueDate)
          }
          onChangeText={(text) =>
            setEditData({ ...editData, dpIssueDate: new Date(text) })
          }
        />

        <InfoField
          icon="map-pin"
          label="Nơi cấp"
          value={isEditing ? editData.dpIssueAt : dependent.dpIssueAt}
          onChangeText={(text) => setEditData({ ...editData, dpIssueAt: text })}
        />

        <InfoField
          icon="clock"
          label="Ngày phụ thuộc"
          value={
            isEditing
              ? formatDate(editData.dependentDate)
              : formatDisplayDate(dependent.dependentDate)
          }
          onChangeText={(text) =>
            setEditData({ ...editData, dependentDate: new Date(text) })
          }
        />
      </View>
    </View>
  );
};

interface DependentListProps {
  dependents: dtoDependent[];
  isEditing?: boolean;
  onEdit?: (dependent: dtoDependent) => void;
  onDelete?: (dpUserId: string) => void;
  onSave?: (dependent: dtoDependent) => void;
  onCancel?: () => void;
  onAdd?: () => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export const DependentList: React.FC<DependentListProps> = ({
  dependents,
  isEditing = false,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onAdd,
  showActions = true,
  emptyMessage = "Chưa có thông tin người phụ thuộc",
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.listHeader}>
        {dependents.length > 0 ? 
        <Text style={styles.listTitle}>
          Số người phụ thuộc: {dependents.length}
        </Text> : <Text style={styles.listTitle}>
          Không có người phụ thuộc
        </Text>}
        {onAdd && !isEditing && (
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Thêm</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {dependents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="users" size={48} color="#ccc" />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {dependents.map((dependent, index) => (
            <DependentCard
              key={dependent.dpUserId}
              dependent={dependent}
              index={index}
              isEditing={isEditing}
              onEdit={onEdit}
              onDelete={onDelete}
              onSave={onSave}
              onCancel={onCancel}
              showActions={showActions}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3674B5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#3674B5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indexBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3674B5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  indexText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  headerInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#3674B5",
    paddingVertical: 4,
  },
  userId: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#FF9800",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
  },
  content: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 12,
    color: "#333",
    flex: 1,
    fontFamily: "monospace",
  },
  infoInput: {
    fontSize: 12,
    color: "#333",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#3674B5",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});

export default DependentCard;
