import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DependentList } from "../../../../components/ui/DependentCard";
import { dtoDependent, dtoGetUser, dtoUpdateUser } from "../../../../models/auth/dtoUser";

interface DependentInfoProps {
  userData: dtoGetUser | undefined;
  onUpdateUserData: (data: dtoUpdateUser) => void;
}

const DependentInfo: React.FC<DependentInfoProps> = ({
  userData,
  onUpdateUserData,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to API
  };

  const handleCancel = () => {
    setIsEditing(false);
    // TODO: Reset data
  };

  const handleEditDependent = () => {
    setIsEditing(true);
  };

  const handleSaveDependent = (dependent: dtoDependent) => {
    // TODO: Save dependent to API
    console.log("Save dependent:", dependent);
  };

  const handleCancelDependent = () => {
    setIsEditing(false);
  };

  const handleDeleteDependent = (dpUserId: string) => {
    // TODO: Delete dependent from API
    console.log("Delete dependent:", dpUserId);
    const updatedDependents = userData?.dependent.filter(
      (dep: dtoDependent) => dep.dpUserId !== dpUserId
    );
    onUpdateUserData({ ...userData, dependent: updatedDependents } as dtoGetUser);
  };

  const handleAddDependent = () => {
    console.log("Add new dependent");
    const newDependent: dtoDependent = {
      dpId: "",
      dpUserId: (userData?.dependent?.length || 0 + 1).toString(),
      dpFullName: "",
      dpPhone: "",
      dpTaxCode: "",
      dpCitizenIdentityCard: "",
      dpIssueDate: new Date(),
      dpIssueAt: "",
      dependentDate: new Date(),
    };
    onUpdateUserData({
      ...userData as dtoUpdateUser,
      dependent: [...(userData?.dependent || []), newDependent] as dtoDependent[],
    } as dtoUpdateUser);
  };

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <DependentList
          dependents={userData?.dependent as dtoDependent[]}
          isEditing={isEditing}
          onEdit={handleEditDependent}
          onDelete={handleDeleteDependent}
          onSave={handleSaveDependent}
          onCancel={handleCancelDependent}
          onAdd={handleAddDependent}
          showActions={true}
          emptyMessage="Chưa có thông tin người phụ thuộc. Nhấn 'Thêm' để thêm mới."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerActionButtonEdit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  headerActionButtonEditText: {
    color: "#3674B5",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerActionButtonSave: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D69E2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerActionButtonSaveText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerActionButtonCancel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E53E3E",
  },
  headerActionButtonCancelText: {
    color: "#E53E3E",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default DependentInfo;
