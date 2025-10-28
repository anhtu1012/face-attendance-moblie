import AlertModal from "@/components/ui/AlertModal";
import { DependentCard } from "@/components/ui/DependentCard";
import { useDeleteDependent } from "@/hooks/useDeleteDependent";
import { useGetDependentByUser } from "@/hooks/useGetDependentByUser";
import { useUpdateDependent } from "@/hooks/useUpdateDependent";
import { dtoDependent } from "@/models/auth/dtoUser";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  Alert,
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
});

export default DependentInfo;
