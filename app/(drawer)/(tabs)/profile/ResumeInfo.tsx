import AlertModal from "@/components/ui/AlertModal";
import CustomProfileInput from "@/components/ui/CustomProfileInput";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import ScanQRCodeModal from "@/components/ui/ScanQRCodeModal";
import { DEFAULT_ISSUE_AT } from "@/constants/resume";
import { Feather } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
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
import { RadioGroup } from "../../../../components/ui/RadioButton";
import { NATION_OPTIONS } from "../../../../models/data/nation";
import { NATIONALITY_OPTIONS } from "../../../../models/data/nationality";
interface ResumeInfoProps {
  formik: any;
  isEditing: boolean;
}

const ResumeInfo: React.FC<ResumeInfoProps> = ({ formik, isEditing }) => {
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [showNationDropdown, setShowNationDropdown] = useState(false);

  // Search state moved inside SearchableDropdownModal to avoid parent re-renders per keystroke
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanQrModal, setShowScanQrModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState({
    visible: false,
    message: "",
    type: "success",
    title: "",
  });

  const handleScanQrCode = () => {
    if (permission?.status !== "granted") {
      requestPermission();
    } else {
      setShowScanQrModal(true);
    }
  };

  const CustomDropdown = ({
    error,
    icon,
    label,
    iconColor,
    value,
    placeholder = "Chọn",
    options,
    onToggleDropdown,
  }: any) => {
    const getDisplayText = () => {
      if (typeof value === "object") return value?.label || value?.value;
      if (Array.isArray(options)) {
        const matched = options.find((o: any) => o.value === value);
        return matched?.label || value;
      }
      return value;
    };
    const displayText = getDisplayText();
    return (
      <View
        style={[styles.infoItem, error && { borderBottomColor: "#FF4D4F" }]}
      >
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
                style={[
                  styles.dropdownText,
                  !displayText && styles.placeholderText,
                ]}
              >
                {displayText || placeholder}
              </Text>
              <Feather name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.infoValue, error && { color: "#FF4D4F" }]}>
              {displayText || "Chưa cập nhật"}
            </Text>
          )}
        </View>
      </View>
    );
  };
  interface ParsedCCCDData {
    citizenIdentityCard: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    permanentAddress: string;
    issueDate: Date;
  }
  const parseDate = (dateString: string): Date => {
    try {
      if (dateString.length === 8) {
        const day = dateString.substring(0, 2);
        const month = dateString.substring(2, 4);
        const year = dateString.substring(4, 8);
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
        );
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date");
        }

        return date;
      }
      throw new Error("Invalid date format");
    } catch (error) {
      console.error("Error parsing date:", error);
      return new Date();
    }
  };
  const handleParseIDData = (data: string) => {
    const parts = data.split("|");
    if (parts.length !== 7) {
      setShowAlertModal({
        visible: true,
        message: "Mã QR không hợp lệ",
        type: "error",
        title: "Thông báo",
      });
      setShowScanQrModal(false);
      return;
    }
    const parsedData: ParsedCCCDData = {
      citizenIdentityCard: parts[0],
      fullName: parts[2],
      dateOfBirth: parseDate(parts[3]),
      gender: parts[4],
      permanentAddress: parts[5],
      issueDate: parseDate(parts[6]),
    };
    const formattedGender = parsedData.gender === "Nam" ? "M" : "F";
    formik.setValues({
      ...formik.values,
      citizenIdentityCard: parsedData.citizenIdentityCard,
      fullName: parsedData.fullName,
      birthday: parsedData.dateOfBirth,
      gender: formattedGender,
      permanentAddress: parsedData.permanentAddress,
      nationality: NATIONALITY_OPTIONS[0].value,
      nation: NATION_OPTIONS[0].value,
      issueDate: parsedData.issueDate,
      issueAt: DEFAULT_ISSUE_AT,
    });
    setShowAlertModal({
      visible: true,
      message: "Dữ liệu đã được điền tự động, vui lòng kiểm tra lại",
      type: "success",
      title: "Thông báo",
    });
    setShowScanQrModal(false);
  };

  const SearchableDropdownModal = React.memo(
    ({ visible, onClose, title, options, selectedValue, onSelect }: any) => {
      const [searchValue, setSearchValue] = useState("");
      React.useEffect(() => {
        if (!visible) setSearchValue("");
      }, [visible]);

      const filteredOptions = React.useMemo(
        () =>
          options.filter((option: any) =>
            option.label.toLowerCase().includes(searchValue.toLowerCase()),
          ),
        [options, searchValue],
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
                  onChangeText={setSearchValue}
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
                      selectedValue === item.value && styles.selectedItem,
                    ]}
                    onPress={() => {
                      onSelect(item.value);
                      onClose();
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedValue === item.value && styles.selectedItemText,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selectedValue === item.value && (
                      <Feather name="check" size={16} color="#3674B5" />
                    )}
                  </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="always"
                initialNumToRender={12}
                windowSize={5}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      );
    },
  );

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
          {isEditing && (
            <TouchableOpacity
              onPress={handleScanQrCode}
              style={styles.qrButton}
            >
              <Feather name="maximize" size={20} color="#3674B5" />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.infoCard}>
          <CustomProfileInput
            error={formik.errors.fullName}
            icon="user"
            label="Họ và tên"
            value={formik.values.fullName}
            onChangeText={(text: string) =>
              formik.setFieldValue("fullName", text)
            }
            iconColor="#3674B5"
            isEditing={isEditing}
          />
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
            showDropdown={showNationDropdown}
            onToggleDropdown={() => setShowNationDropdown(true)}
          />
          <DatePickerInput
            label="Ngày sinh"
            value={formik.values.birthday}
            error={formik.errors.birthday as string}
            onChange={(date: Date) => formik.setFieldValue("birthday", date)}
            onFocus={() => formik.setFieldTouched("birthday", true)}
            maximumDate={new Date()}
            placeholder="Chọn ngày sinh"
            isEditing={isEditing}
          />
          {/* Gender Selection */}
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Feather name="user" size={20} color="#4CAF50" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Giới tính</Text>
              {isEditing ? (
                <RadioGroup
                  options={[
                    { label: "Nam", value: "M" },
                    { label: "Nữ", value: "F" },
                  ]}
                  selectedValue={formik.values.gender}
                  onValueChange={(value) =>
                    formik.setFieldValue("gender", value as "M" | "F")
                  }
                  direction="row"
                  containerStyle={styles.radioGroupContainer}
                  itemStyle={styles.radioItem}
                />
              ) : (
                <Text style={styles.infoValue}>
                  {formik.values.gender === "M"
                    ? "Nam"
                    : formik.values.gender === "F"
                      ? "Nữ"
                      : "Không xác định"}
                </Text>
              )}
            </View>
          </View>

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
        </View>
      </ScrollView>

      <SearchableDropdownModal
        visible={showNationalityDropdown}
        onClose={() => {
          setShowNationalityDropdown(false);
        }}
        title="Chọn quốc tịch"
        options={NATIONALITY_OPTIONS}
        selectedValue={formik.values.nationality}
        onSelect={(value: string) => formik.setFieldValue("nationality", value)}
      />

      <SearchableDropdownModal
        visible={showNationDropdown}
        onClose={() => {
          setShowNationDropdown(false);
        }}
        title="Chọn dân tộc"
        options={NATION_OPTIONS}
        selectedValue={formik.values.nation}
        onSelect={(value: string) => formik.setFieldValue("nation", value)}
      />

      <ScanQRCodeModal
        visible={showScanQrModal}
        onClose={() => setShowScanQrModal(false)}
        onScanSuccess={(data: string) => {
          handleParseIDData(data);
          setShowScanQrModal(false);
        }}
      />
      <AlertModal
        visible={showAlertModal.visible}
        onClose={() => {
          setShowAlertModal({
            visible: false,
            message: "",
            type: "success",
            title: "",
          });
        }}
        type={showAlertModal.type as "success" | "error" | "warning" | "info"}
        title={showAlertModal.title}
        message={showAlertModal.message}
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
  radioGroupContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  radioItem: {
    marginRight: 20,
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
  qrButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F0F7FF",
    borderWidth: 1,
    borderColor: "#3674B5",
  },
});

export default ResumeInfo;
