import CustomProfileInput from "@/components/ui/CustomProfileInput";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { dtoGetUser, dtoUpdateUser } from "../../../../models/auth/dtoUser";
import { MILITARY_STATUS_OPTIONS } from "../../../../models/data/militaryStatus";
import { NATION_OPTIONS } from "../../../../models/data/nation";
import { NATIONALITY_OPTIONS } from "../../../../models/data/nationality";
interface ResumeInfoProps {
  userData: dtoGetUser | undefined;
  onUpdateUserData: (data: dtoUpdateUser) => void;
}

const ResumeInfo: React.FC<ResumeInfoProps> = ({
  userData,
  onUpdateUserData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [showNationDropdown, setShowNationDropdown] = useState(false);
  const [showMilitaryStatusDropdown, setShowMilitaryStatusDropdown] =
    useState(false);
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [nationSearch, setNationSearch] = useState("");

  const initialValues = {
    citizenIdentityCard: userData?.citizenIdentityCard || "",
    issueDate: userData?.issueDate ? new Date(userData.issueDate) : new Date(),
    issueAt: userData?.issueAt || "",
    taxCode: userData?.taxCode || "",
    nationality: userData?.nationality || "",
    nation: userData?.nation || "",
    permanentAddress: userData?.permanentAddress || "",
    currentAddress: userData?.currentAddress || "",
    militaryStatus: userData?.militaryStatus || "",
  };

  const validateSchema = Yup.object().shape({
    citizenIdentityCard: Yup.string()
      .matches(/^\d{9}$|^\d{12}$/, "Số CMND/CCCD phải gồm 9 hoặc 12 chữ số")
      .required("Số CMND/CCCD là bắt buộc"),
    issueDate: Yup.date().required("Ngày cấp là bắt buộc"),
    issueAt: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Nơi cấp là bắt buộc"),
    taxCode: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Mã số thuế là bắt buộc")
      .matches(
        /^[0-9]{10}([0-9]{3})?$/,
        "Mã số thuế phải gồm 10 hoặc 13 chữ số"
      ),
    nationality: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Quốc tịch là bắt buộc"),
    nation: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Dân tộc là bắt buộc"),
    permanentAddress: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Địa chỉ thường trú là bắt buộc"),
    currentAddress: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Địa chỉ hiện tại là bắt buộc"),
    militaryStatus: Yup.string()
      .required("Tình trạng quân dịch là bắt buộc")
      .oneOf(
        MILITARY_STATUS_OPTIONS.map((option) => option.value),
        "Tình trạng quân dịch không hợp lệ"
      ),
  });

  const validate = (values: typeof initialValues) => {
    const errors: any = {};
    try {
      validateSchema.validateSync(values, { abortEarly: false });
    } catch (validationError: any) {
      if (validationError.inner && Array.isArray(validationError.inner)) {
        validationError.inner.forEach((error: any) => {
          errors[error.path] = error.message;
        });
      }
    }
    return errors;
  };

  const handleSubmit = (values: typeof initialValues) => {
    const trimmedValues = {
      ...values,
      citizenIdentityCard: values.citizenIdentityCard.trim(),
      issueAt: values.issueAt.trim(),
      taxCode: values.taxCode.trim(),
      nationality: values.nationality.trim(),
      nation: values.nation.trim(),
      permanentAddress: values.permanentAddress.trim(),
      currentAddress: values.currentAddress.trim(),
      militaryStatus: values.militaryStatus,
      issueDate: values.issueDate,
    };
    const onboardData = { ...userData, ...trimmedValues } as dtoUpdateUser;
    console.log("Form submitted:", onboardData);
    onUpdateUserData(onboardData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const CustomDropdown = ({
    error,
    icon,
    label,
    iconColor,
    value,
    options,
    onSelect,
    placeholder = "Chọn",
    searchValue,
    onSearchChange,
    showDropdown,
    onToggleDropdown,
  }: any) => (
    <View style={[styles.infoItem, error && { borderBottomColor: "#FF4D4F" }]}>
      <View style={styles.infoIconContainer}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={onToggleDropdown}
          >
            <Text
              style={[styles.dropdownText, !value && styles.placeholderText]}
            >
              {typeof value === "object"
                ? value?.label || value?.value
                : value || placeholder}
            </Text>
            <Feather name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        ) : (
          <Text style={[styles.infoValue, error && { color: "#FF4D4F" }]}>
            {typeof value === "object"
              ? value?.label || value?.value
              : value || "Chưa cập nhật"}
          </Text>
        )}
      </View>
    </View>
  );

  const SearchableDropdownModal = ({
    visible,
    onClose,
    title,
    options,
    selectedValue,
    onSelect,
    searchValue,
    onSearchChange,
  }: any) => {
    const filteredOptions = options.filter((option: any) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Feather
                name="search"
                size={16}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChangeText={onSearchChange}
                placeholderTextColor="#999"
              />
            </View>
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedValue === item && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedValue === item && styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedValue === item && (
                    <Feather name="check" size={16} color="#3674B5" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Sơ yếu lý lịch</Text>
          {isEditing ? (
            <View style={styles.actionButtons}>
               <TouchableOpacity
                style={styles.headerActionButtonCancel}
                onPress={handleCancel}
              >
                <MaterialIcons name="close" size={20} color="#666" />
                <Text style={styles.headerActionButtonCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionButtonCancel}
                onPress={handleCancel}
              >
                <MaterialIcons name="close" size={20} color="#666" />
                <Text style={styles.headerActionButtonCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionButtonSave}
                onPress={formik.submitForm}
              >
                <MaterialIcons name="save" size={20} color="white" />
                <Text style={styles.headerActionButtonSaveText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.headerActionButtonEdit}
              onPress={() => setIsEditing(true)}
            >
              <MaterialIcons name="edit" size={24} color="#3674B5" />
              <Text style={styles.headerActionButtonEditText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.infoCard}>
          <CustomProfileInput
            error={formik.errors.citizenIdentityCard}
            icon="credit-card"
            label="Số CCCD/CMND"
            value={formik.values.citizenIdentityCard}
            onChangeText={(text: string) =>
              formik.setFieldValue("citizenIdentityCard", text)
            }
            iconColor="#3674B5"
            isEditing={isEditing}
          />

          <DatePickerInput
            label="Ngày cấp"
            value={formik.values.issueDate}
            error={formik.errors.issueDate as string}
            onChange={(date: Date) => formik.setFieldValue("issueDate", date)}
            onFocus={() => formik.setFieldTouched("issueDate", true)}
            icon="calendar"
            iconColor="#38A169"
            isEditing={isEditing}
            maximumDate={new Date()}
            placeholder="Chọn ngày cấp"
          />

          <CustomProfileInput
            error={formik.errors.issueAt}
            icon="map-pin"
            label="Nơi cấp"
            value={formik.values.issueAt}
            onChangeText={(text: string) =>
              formik.setFieldValue("issueAt", text)
            }
            iconColor="#3182CE"
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.taxCode}
            icon="credit-card"
            label="Mã số thuế"
            value={formik.values.taxCode}
            onChangeText={(text: string) =>
              formik.setFieldValue("taxCode", text)
            }
            iconColor="#D69E2E"
            isEditing={isEditing}
          />

          <CustomDropdown
            error={formik.errors.nationality}
            icon="flag"
            label="Quốc tịch"
            value={formik.values.nationality}
            options={NATIONALITY_OPTIONS}
            onSelect={(value: string) =>
              formik.setFieldValue("nationality", value)
            }
            iconColor="#9C27B0"
            placeholder="Chọn quốc tịch"
            searchValue={nationalitySearch}
            onSearchChange={setNationalitySearch}
            showDropdown={showNationalityDropdown}
            onToggleDropdown={() => setShowNationalityDropdown(true)}
          />

          <CustomDropdown
            error={formik.errors.nation}
            icon="users"
            label="Dân tộc"
            value={formik.values.nation}
            options={NATION_OPTIONS}
            onSelect={(value: string) => formik.setFieldValue("nation", value)}
            iconColor="#FF5722"
            placeholder="Chọn dân tộc"
            searchValue={nationSearch}
            onSearchChange={setNationSearch}
            showDropdown={showNationDropdown}
            onToggleDropdown={() => setShowNationDropdown(true)}
          />

          <CustomProfileInput
            error={formik.errors.permanentAddress}
            icon="home"
            label="Nơi thường trú"
            value={formik.values.permanentAddress}
            onChangeText={(text: string) =>
              formik.setFieldValue("permanentAddress", text)
            }
            iconColor="#607D8B"
            multiline
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.currentAddress}
            icon="map-pin"
            label="Địa chỉ hiện tại"
            value={formik.values.currentAddress}
            onChangeText={(text: string) =>
              formik.setFieldValue("currentAddress", text)
            }
            iconColor="#795548"
            multiline
            isEditing={isEditing}
          />

          <CustomDropdown
            error={formik.errors.militaryStatus}
            icon="shield"
            label="Tình trạng quân dịch"
            value={formik.values.militaryStatus}
            options={MILITARY_STATUS_OPTIONS.map((option) => option.value)}
            onSelect={(value: string) =>
              formik.setFieldValue("militaryStatus", value)
            }
            iconColor="#3F51B5"
            placeholder="Chọn tình trạng quân dịch"
            showDropdown={showMilitaryStatusDropdown}
            onToggleDropdown={() => setShowMilitaryStatusDropdown(true)}
          />
        </View>
      </ScrollView>

      <SearchableDropdownModal
        visible={showNationalityDropdown}
        onClose={() => {
          setShowNationalityDropdown(false);
          setNationalitySearch("");
        }}
        title="Chọn quốc tịch"
        options={NATIONALITY_OPTIONS}
        selectedValue={formik.values.nationality}
        onSelect={(value: string) => formik.setFieldValue("nationality", value)}
        searchValue={nationalitySearch}
        onSearchChange={setNationalitySearch}
      />

      <SearchableDropdownModal
        visible={showNationDropdown}
        onClose={() => {
          setShowNationDropdown(false);
          setNationSearch("");
        }}
        title="Chọn dân tộc"
        options={NATION_OPTIONS}
        selectedValue={formik.values.nation}
        onSelect={(value: string) => formik.setFieldValue("nation", value)}
        searchValue={nationSearch}
        onSearchChange={setNationSearch}
      />

      <Modal
        visible={showMilitaryStatusDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMilitaryStatusDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMilitaryStatusDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>
                Chọn tình trạng quân dịch
              </Text>
              <TouchableOpacity
                onPress={() => setShowMilitaryStatusDropdown(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={MILITARY_STATUS_OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    formik.values.militaryStatus === item.value &&
                      styles.selectedItem,
                  ]}
                  onPress={() => {
                    formik.setFieldValue("militaryStatus", item.value);
                    setShowMilitaryStatusDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      formik.values.militaryStatus === item.value &&
                        styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {formik.values.militaryStatus === item.value && (
                    <Feather name="check" size={16} color="#3674B5" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
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
    paddingBottom: 250, // Extra space for keyboard
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

  infoCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: "center",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  // Dropdown styles
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: 40,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: 400,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedItem: {
    backgroundColor: "#f8f9fa",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedItemText: {
    color: "#3674B5",
    fontWeight: "500",
  },
});

export default ResumeInfo;
