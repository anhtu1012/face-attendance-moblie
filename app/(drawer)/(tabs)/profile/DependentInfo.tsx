import AlertModal from "@/components/ui/AlertModal";
import CustomProfileInput from "@/components/ui/CustomProfileInput";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { DependentCard } from "@/components/ui/DependentCard";
import { useAddDependent } from "@/hooks/useAddDependent";
import { useDeleteDependent } from "@/hooks/useDeleteDependent";
import { useGetDependentByUser } from "@/hooks/useGetDependentByUser";
import { useUpdateDependent } from "@/hooks/useUpdateDependent";
import { dtoDependent } from "@/models/auth/dtoUser";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

interface DependentInfoProps {
  userId: string;
}
const DependentInfo: React.FC<DependentInfoProps> = ({ userId }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const updateDependent = useUpdateDependent();
  const addDependent = useAddDependent();
  const deleteDependent = useDeleteDependent();
  const {
    data: dependentsData,
    isLoading,
    error,
    refetch,
  } = useGetDependentByUser(userId);
  console.log("dependentsData: ", dependentsData);
  const [showAlertModal, setShowAlertModal] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
    title: "",
  });
  const [editingDependent, setEditingDependent] = useState<dtoDependent>({
    dpId: "",
    dpUserId: "",
    dpFullName: "",
    dpPhone: "",
    dpTaxCode: "",
    dpCitizenIdentityCard: "",
    dpIssueDate: new Date(),
    dpIssueAt: "",
    dpDependentDate: new Date(),
  });

  const [newDependent, setNewDependent] = useState({
    dpUserId: userId,
    dpFullName: "",
    dpPhone: "",
    dpTaxCode: "",
    dpCitizenIdentityCard: "",
    dpIssueDate: new Date(),
    dpIssueAt: "",
    dpDependentDate: new Date(),
  });

  const validateSchema = Yup.object().shape({
    dpFullName: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Họ và tên là bắt buộc")
      .matches(/^[\p{L}\s'-]+$/u, "Tên không được chứa ký tự đặc biệt hoặc số"),
    dpPhone: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .matches(/^[0-9]{10,11}$/, "Số điện thoại phải gồm 10 hoặc 11 chữ số")
      .required("Số điện thoại là bắt buộc"),
    dpTaxCode: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Mã số thuế là bắt buộc")
      .matches(
        /^[0-9]{10}([0-9]{3})?$/,
        "Mã số thuế phải gồm 10 hoặc 13 chữ số"
      ),
    dpCitizenIdentityCard: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .matches(/^\d{9}$|^\d{12}$/, "Số CMND/CCCD phải gồm 9 hoặc 12 chữ số")
      .required("Số CMND/CCCD là bắt buộc"),
    dpIssueDate: Yup.date().required("Ngày cấp là bắt buộc"),
    dpIssueAt: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Nơi cấp là bắt buộc"),
    dpDependentDate: Yup.date().required("Ngày phụ thuộc là bắt buộc"),
  });
  type DependentFormValues = Omit<dtoDependent, "dpId"> & { dpId?: string };

  const validate = (values: DependentFormValues) => {
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
  const handleDelete = (dpId: string) => {
    const confirmDelete = () => {
      deleteDependent.mutate(dpId, {
        onSuccess: () => {
          setShowAlertModal({
            visible: true,
            message: "Xóa thành công",
            type: "success",
            title: "Thành công",
          });
          refetch();
        },
        onError: () => {
          setShowAlertModal({
            visible: true,
            message: "Xóa thất bại",
            type: "error",
            title: "Lỗi",
          });
        },
      });
    };
    Alert.alert(
      "Xóa người phụ thuộc",
      "Bạn có chắc chắn muốn xóa người phụ thuộc này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: confirmDelete },
      ]
    );
  };
  const handleSubmit = (values: typeof editingDependent) => {
    const trimmedValues = {
      ...values,
      dpFullName: values.dpFullName.trim(),
      dpPhone: values.dpPhone.trim(),
      dpTaxCode: values.dpTaxCode.trim(),
      dpCitizenIdentityCard: values.dpCitizenIdentityCard.trim(),
      dpIssueAt: values.dpIssueAt.trim(),
    };
    console.log("Submitting dependent data:", trimmedValues);
    updateDependent.mutate(trimmedValues as dtoDependent, {
      onSuccess: (data) => {
        console.log("Update successful:", data);
        setShowAlertModal({
          visible: true,
          message: "Cập nhật thành công",
          type: "success",
          title: "Thành công",
        });
        setIsEditing(false);
        setEditingIndex(null);
        refetch();
      },
      onError: (error) => {
        console.error("Update failed:", error);
        setShowAlertModal({
          visible: true,
          message: `Cập nhật thất bại: ${error.message || "Unknown error"}`,
          type: "error",
          title: "Lỗi",
        });
      },
    });
    setIsEditing(false);
    console.log(trimmedValues);
  };
  const formik = useFormik({
    initialValues: editingDependent,
    enableReinitialize: true,
    validate,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });
  const handleCancel = () => {
    formik.resetForm();
  };

  const handleAddSubmit = (values: typeof newDependent) => {
    const trimmedValues = {
      ...values,
      dpFullName: values.dpFullName.trim(),
      dpPhone: values.dpPhone.trim(),
      dpTaxCode: values.dpTaxCode.trim(),
      dpCitizenIdentityCard: values.dpCitizenIdentityCard.trim(),
      dpIssueAt: values.dpIssueAt.trim(),
    };
    console.log("Adding dependent data:", trimmedValues);
    addDependent.mutate(
      {
        dpId: "",
        ...trimmedValues,
      } as dtoDependent,
      {
        onSuccess: (data) => {
          console.log("Add successful:", data);
          setShowAlertModal({
            visible: true,
            message: "Thêm người phụ thuộc thành công",
            type: "success",
            title: "Thành công",
          });
          setShowAddModal(false);
          addFormik.resetForm();
          setNewDependent({
            dpUserId: userId,
            dpFullName: "",
            dpPhone: "",
            dpTaxCode: "",
            dpCitizenIdentityCard: "",
            dpIssueDate: new Date(),
            dpIssueAt: "",
            dpDependentDate: new Date(),
          });
          refetch();
        },
        onError: (error: any) => {
          console.error("Add failed:", error);
          setShowAlertModal({
            visible: true,
            message: `Thêm thất bại: ${error.message || "Unknown error"}`,
            type: "error",
            title: "Lỗi",
          });
        },
      }
    );
  };

  const addFormik = useFormik({
    initialValues: newDependent,
    enableReinitialize: true,
    validate,
    onSubmit: handleAddSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });
  const handleEdit = (dep: dtoDependent, index: number) => {
    setEditingIndex(index);
    setEditingDependent({
      dpId: dep.dpId ?? "",
      dpUserId: dep.dpUserId ?? "",
      dpFullName: dep.dpFullName ?? "",
      dpPhone: dep.dpPhone ?? "",
      dpTaxCode: dep.dpTaxCode ?? "",
      dpCitizenIdentityCard: dep.dpCitizenIdentityCard ?? "",
      dpIssueDate: dep.dpIssueDate ? new Date(dep.dpIssueDate) : new Date(),
      dpIssueAt: dep.dpIssueAt ?? "",
      dpDependentDate: dep.dpDependentDate
        ? new Date(dep.dpDependentDate)
        : new Date(),
    });
    setIsEditing(!isEditing);
  };

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
                isEditingThis={isEditing && editingIndex === index}
                onEdit={handleEdit}
                formikValues={formik.values}
                formikErrors={formik.errors}
                setFieldValue={formik.setFieldValue}
                onSubmit={formik.handleSubmit}
                onDelete={handleDelete}
              />
            ))
          )}
        </View>
      </ScrollView>
      <AlertModal
        visible={showAlertModal.visible}
        type={showAlertModal.type as "success" | "error" | "info" | "warning"}
        title={showAlertModal.title}
        message={showAlertModal.message}
        onClose={() =>
          setShowAlertModal({
            visible: false,
            message: "",
            type: "success",
            title: "",
          })
        }
        onConfirm={() => {
          setShowAlertModal({
            visible: false,
            message: "",
            type: "success",
            title: "",
          });
        }}
        confirmText="OK"
        cancelText="Hủy"
      />
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm người phụ thuộc</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddModal(false);
                  addFormik.resetForm();
                  setNewDependent({
                    dpUserId: userId,
                    dpFullName: "",
                    dpPhone: "",
                    dpTaxCode: "",
                    dpCitizenIdentityCard: "",
                    dpIssueDate: new Date(),
                    dpIssueAt: "",
                    dpDependentDate: new Date(),
                  });
                }}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View style={styles.formContainer}>
                <CustomProfileInput
                  label="Họ và tên"
                  value={addFormik.values.dpFullName}
                  onChangeText={(text: string) =>
                    addFormik.setFieldValue("dpFullName", text)
                  }
                  icon="user"
                  iconColor="#3674B5"
                  error={addFormik.errors.dpFullName as string}
                  isEditing
                />
                <CustomProfileInput
                  label="Số điện thoại"
                  value={addFormik.values.dpPhone}
                  onChangeText={(text: string) =>
                    addFormik.setFieldValue("dpPhone", text)
                  }
                  icon="phone"
                  iconColor="#3674B5"
                  error={addFormik.errors.dpPhone as string}
                  isEditing
                  keyboardType="phone-pad"
                />
                <CustomProfileInput
                  label="Mã số thuế"
                  value={addFormik.values.dpTaxCode}
                  onChangeText={(text: string) =>
                    addFormik.setFieldValue("dpTaxCode", text)
                  }
                  icon="credit-card"
                  iconColor="#3674B5"
                  error={addFormik.errors.dpTaxCode as string}
                  isEditing
                  keyboardType="numeric"
                />
                <CustomProfileInput
                  label="Số CMND/CCCD"
                  value={addFormik.values.dpCitizenIdentityCard}
                  onChangeText={(text: string) =>
                    addFormik.setFieldValue("dpCitizenIdentityCard", text)
                  }
                  icon="credit-card"
                  iconColor="#3674B5"
                  error={addFormik.errors.dpCitizenIdentityCard as string}
                  isEditing
                  keyboardType="numeric"
                />
                <CustomProfileInput
                  label="Nơi cấp"
                  value={addFormik.values.dpIssueAt}
                  onChangeText={(text: string) =>
                    addFormik.setFieldValue("dpIssueAt", text)
                  }
                  icon="map-pin"
                  iconColor="#3674B5"
                  error={addFormik.errors.dpIssueAt as string}
                  isEditing
                />
                <DatePickerInput
                  label="Ngày cấp"
                  value={addFormik.values.dpIssueDate}
                  onChange={(date: Date) =>
                    addFormik.setFieldValue("dpIssueDate", date)
                  }
                  icon="event"
                  iconColor="#3674B5"
                  error={addFormik.errors.dpIssueDate as string}
                  isEditing
                />
                <DatePickerInput
                  label="Ngày phụ thuộc"
                  value={addFormik.values.dpDependentDate}
                  onChange={(date: Date) =>
                    addFormik.setFieldValue("dpDependentDate", date)
                  }
                  icon="schedule"
                  iconColor="#3674B5"
                  error={addFormik.errors.dpDependentDate as string}
                  isEditing
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  addFormik.resetForm();
                  setNewDependent({
                    dpUserId: userId,
                    dpFullName: "",
                    dpPhone: "",
                    dpTaxCode: "",
                    dpCitizenIdentityCard: "",
                    dpIssueDate: new Date(),
                    dpIssueAt: "",
                    dpDependentDate: new Date(),
                  });
                }}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => addFormik.handleSubmit()}
                disabled={addDependent.isPending}
              >
                <Text style={styles.submitButtonText}>
                  {addDependent.isPending ? "Đang thêm..." : "Thêm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    flexDirection: "column",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  formContainer: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3674B5",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default DependentInfo;
