import CustomProfileInput from "@/components/ui/CustomProfileInput";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { dtoDependent } from "@/models/auth/dtoUser";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

interface DependentInfoProps {
  dependentsData: dtoDependent[];
}
const DependentInfo: React.FC<DependentInfoProps> = ({ dependentsData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDependent, setEditingDependent] = useState<dtoDependent>(
    {
      dpId: "",
      dpUserId: "",
      dpFullName: "",
      dpPhone: "",
      dpTaxCode: "",
      dpCitizenIdentityCard: "",
      dpIssueDate: new Date(),
      dpIssueAt: "",
      dpDependentDate: new Date(),
    }
  );


  const validateSchema = Yup.object().shape({
    dpFullName: Yup.string().required("Họ và tên là bắt buộc"),
    dpPhone: Yup.string().required("Số điện thoại là bắt buộc"),
    dpTaxCode: Yup.string().required("Mã số thuế là bắt buộc"),
    dpCitizenIdentityCard: Yup.string().required("Số CMND/CCCD là bắt buộc"),
    dpIssueDate: Yup.date().required("Ngày cấp là bắt buộc"),
    dpIssueAt: Yup.string().required("Nơi cấp là bắt buộc"),
    dpDependentDate: Yup.date().required("Ngày phụ thuộc là bắt buộc"),
  });
  const validate = (values: typeof editingDependent) => {
    const errors: any = {};
    try {
      validateSchema.validateSync(values, { abortEarly: false });
    } catch (validationError: any) {
      validationError.inner.forEach((error: any) => {
        errors[error.path] = error.message;
      });
    }
    return errors;
  };
  const handleSubmit = (values: typeof editingDependent) => {
    console.log(values);
  };
  const formik = useFormik({
    initialValues: editingDependent,
    validate,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });
  const handleCancel = () => {
    formik.resetForm();
  };
  const handleEdit = (dep: dtoDependent, index: number) => {
    setEditingDependent(dep);
    setEditingDependent({
      dpId: dep.dpId ?? "",
      dpUserId: dep.dpUserId ?? "",
      dpFullName: dep.dpFullName ?? "",
      dpPhone: dep.dpPhone ?? "",
      dpTaxCode: dep.dpTaxCode ?? "",
      dpCitizenIdentityCard: dep.dpCitizenIdentityCard ?? "",
      dpIssueDate: dep.dpIssueDate ? new Date(dep.dpIssueDate) : new Date(),
      dpIssueAt: dep.dpIssueAt ?? "",
      dpDependentDate: dep.dpDependentDate ? new Date(dep.dpDependentDate) : new Date(),
    });
    setIsEditing(true);
  };
  const DependentCard = ({
    dependent,
    index,
  }: {
    dependent: dtoDependent;
    index: number;
  }) => (

    <View style={styles.dependentCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{index + 1}. {dependent.dpFullName}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              handleEdit(dependent, index);
            }}
          >
            <Feather name="edit" size={16} color="#3674B5" />
          </TouchableOpacity>
          {isEditing && dependent.dpId === editingDependent?.dpId && (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={() => {
                formik.handleSubmit();
              }}>
                <Feather name="save" size={16} color="orange" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Feather name="trash-2" size={16} color="#E53E3E" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContent}>
        <CustomProfileInput
          label="Họ và tên"
          value={formik.values.dpFullName}
          onChangeText={(text: string) =>
            formik.setFieldValue("dpFullName", text)
          }
          icon="user"
          iconColor="#3674B5"
          error={formik.errors.dpFullName}
          isEditing={dependent.dpId === editingDependent?.dpId && isEditing}
        />
        <CustomProfileInput
          label="Số điện thoại"
          value={formik.values.dpPhone}
          onChangeText={(text: string) =>
            formik.setFieldValue("dpPhone", text)
          }
          icon="phone"
          iconColor="#3674B5"
          error={formik.errors.dpPhone}
          isEditing={dependent.dpId === editingDependent?.dpId && isEditing}
        />
       <CustomProfileInput
          label="Mã số thuế"
          value={formik.values.dpTaxCode}
          onChangeText={(text: string) =>
            formik.setFieldValue("dpTaxCode", text)
          }
          icon="credit-card"
          iconColor="#3674B5"
          error={formik.errors.dpTaxCode}
          isEditing={dependent.dpId === editingDependent?.dpId && isEditing}
        />
       <CustomProfileInput
          label="Số CMND/CCCD"
          value={formik.values.dpCitizenIdentityCard}
          onChangeText={(text: string) =>
            formik.setFieldValue("dpCitizenIdentityCard", text)
          }
          icon="credit-card"
          iconColor="#3674B5"
          error={formik.errors.dpCitizenIdentityCard}
          isEditing={dependent.dpId === editingDependent?.dpId && isEditing}
        />
       
       <CustomProfileInput
          label="Nơi cấp"
          value={formik.values.dpIssueAt}
          onChangeText={(text: string) =>
            formik.setFieldValue("dpIssueAt", text)
          }
          icon="map-pin"
          iconColor="#3674B5"
          error={formik.errors.dpIssueAt}
          isEditing={dependent.dpId === editingDependent?.dpId && isEditing}
        />
      <DatePickerInput
          label="Ngày cấp"
          value={formik.values.dpIssueDate}
          onChange={(date: Date) =>
            formik.setFieldValue("dpIssueDate", date)
          }
          icon="calendar"
          iconColor="#3674B5"
          isEditing={dependent.dpId === editingDependent?.dpId && isEditing}
        />
       <CustomProfileInput
          label="Nơi cấp"
          value={formik.values.dpIssueAt}
          onChangeText={(text: string) =>
            formik.setFieldValue("dpIssueAt", text)
          }
          icon="map-pin"
          iconColor="#3674B5"
          error={formik.errors.dpIssueAt}
          isEditing={dependent.dpId === editingDependent?.dpId && isEditing}
        />
      <DatePickerInput
          label="Ngày phụ thuộc"
          value={formik.values.dpDependentDate}
          onChange={(date: Date) =>
            formik.setFieldValue("dpDependentDate", date)
          }
          icon="clock"
          iconColor="#3674B5"
          isEditing={dependent.dpId === editingDependent?.dpId && isEditing}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Người phụ thuộc</Text>
          <TouchableOpacity
            style={styles.headerActionButtonEdit}
            onPress={() => {
              setShowAddModal(true);
            }}
          >
            <MaterialIcons name="add" size={20} color="#3674B5" />
            <Text style={styles.headerActionButtonEditText}>Thêm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {dependentsData?.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="users" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                Chưa có thông tin người phụ thuộc
              </Text>
            </View>
          ) : (
            dependentsData?.map((dependent, index) => (
              <DependentCard
                key={dependent.dpId || index}
                dependent={dependent}
                index={index}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    gap: 8,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerActionButtonSaveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 3,
  },
  headerActionButtonCancel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  headerActionButtonCancelText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
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
  // UI-only component; editing and modal styles removed
});

export default DependentInfo;
