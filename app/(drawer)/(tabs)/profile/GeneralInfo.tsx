import CustomProfileInput from "@/components/ui/CustomProfileInput";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MILITARY_STATUS_OPTIONS } from "@/models/data/militaryStatus";
interface GeneralInfoProps {
  formik: any;
  isEditing: boolean;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ formik, isEditing }) => {
  const [showMarriedStatusDropdown, setShowMarriedStatusDropdown] =
    useState(false);
  const [showMilitaryStatusDropdown, setShowMilitaryStatusDropdown] =
    useState(false);

  const MARRIED_STATUS_OPTIONS = [
    { label: "Độc thân", value: "Độc thân" },
    { label: "Đã kết hôn", value: "Đã kết hôn" },
    { label: "Đã ly hôn", value: "Đã ly hôn" },
  ];

  const CustomDropdown = ({
    error,
    icon,
    label,
    iconColor,
    value,
    options,
    onSelect,
    onPress,
    placeholder = "Chọn tình trạng",
  }: any) => (
    <View style={[styles.infoItem, error && { borderBottomColor: "#FF4D4F" }]}>
      <View style={styles.infoIconContainer}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TouchableOpacity style={styles.dropdownButton} onPress={onPress}>
            <Text
              style={[styles.dropdownText, !value && styles.placeholderText]}
            >
              {value || placeholder}
            </Text>
            <Feather name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        ) : (
          <Text style={[styles.infoValue, error && { color: "#FF4D4F" }]}>
            {value || "Chưa cập nhật"}
          </Text>
        )}
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
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Thông tin chung</Text>
        </View>

        {/* Content */}
        <View style={styles.infoCard}>
          <CustomProfileInput
            error={formik.errors.email}
            icon="mail"
            label="Email"
            value={formik.values.email}
            onChangeText={(text: string) => formik.setFieldValue("email", text)}
            iconColor="#E53E3E"
            keyboardType="email-address"
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.phone}
            icon="phone"
            label="Điện thoại"
            value={formik.values.phone}
            onChangeText={(text: string) => formik.setFieldValue("phone", text)}
            iconColor="#38A169"
            keyboardType="phone-pad"
            isEditing={isEditing}
          />
          <CustomProfileInput
            error={formik.errors.taxCode as string}
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
            error={formik.errors.militaryStatus}
            icon="shield"
            label="Tình trạng quân dịch"
            value={formik.values.militaryStatus}
            options={MILITARY_STATUS_OPTIONS}
            onSelect={(value: string) =>
              formik.setFieldValue("militaryStatus", value)
            }
            iconColor="#3F51B5"
            placeholder="Chọn tình trạng quân dịch"
            showDropdown={showMilitaryStatusDropdown}
            onToggleDropdown={() => setShowMilitaryStatusDropdown(true)}
            onPress={() => setShowMilitaryStatusDropdown(true)}
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
          <CustomDropdown
            error={formik.errors.marriedStatus}
            icon="heart"
            label="Tình trạng hôn nhân"
            value={formik.values.marriedStatus}
            options={MARRIED_STATUS_OPTIONS}
            onSelect={(value: string) =>
              formik.setFieldValue("marriedStatus", value)
            }
            iconColor="#E91E63"
            isEditing={isEditing}
            onPress={() => setShowMarriedStatusDropdown(true)}
          />
        </View>
        <Modal
          visible={showMarriedStatusDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMarriedStatusDropdown(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowMarriedStatusDropdown(false)}
          >
            <View style={styles.dropdownModal}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>
                  Chọn tình trạng hôn nhân
                </Text>
                <TouchableOpacity
                  onPress={() => setShowMarriedStatusDropdown(false)}
                  style={styles.closeButton}
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={MARRIED_STATUS_OPTIONS}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      formik.values.marriedStatus === item.value &&
                        styles.selectedItem,
                    ]}
                    onPress={() => {
                      formik.setFieldValue("marriedStatus", item.value);
                      setShowMarriedStatusDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        formik.values.marriedStatus === item.value &&
                          styles.selectedItemText,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {formik.values.marriedStatus === item.value && (
                      <Feather name="check" size={16} color="#3674B5" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Thông tin ngân hàng</Text>
        </View>

        <View style={styles.infoCard}>
          <CustomProfileInput
            error={formik.errors.bankingAccountNo}
            icon="credit-card"
            label="Số tài khoản"
            value={formik.values.bankingAccountNo}
            iconColor="#9C27B0"
            isEditing={isEditing}
            onChangeText={(text: string) =>
              formik.setFieldValue("bankingAccountNo", text)
            }
          />
          <CustomProfileInput
            error={formik.errors.bankingAccountName}
            icon="user"
            label="Tên tài khoản"
            value={formik.values.bankingAccountName}
            iconColor="#FF5722"
            isEditing={isEditing}
            onChangeText={(text: string) =>
              formik.setFieldValue("bankingAccountName", text)
            }
          />
          <CustomProfileInput
            error={formik.errors.bankingName}
            icon="building"
            label="Tên ngân hàng"
            value={formik.values.bankingName}
            iconColor="#607D8B"
            isEditing={isEditing}
            onChangeText={(text: string) =>
              formik.setFieldValue("bankingName", text)
            }
          />
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
    maxHeight: 300,
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

export default GeneralInfo;
