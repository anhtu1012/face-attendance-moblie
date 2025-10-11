import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { dtoUpdateUser } from "../models/auth/dtoUser";

const GENDER_OPTIONS = [
  { label: "Nam", value: "M" },
  { label: "Nữ", value: "F" },
];

const GenderRadio = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error: string;
}) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.inputLabel}>Giới tính</Text>
    <View style={styles.genderRadioRow}>
      {GENDER_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.radioButton,
            value === opt.value && styles.radioButtonActive,
          ]}
          onPress={() => onChange(opt.value)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.radioCircle,
              value === opt.value && styles.radioCircleActive,
            ]}
          >
            {value === opt.value && <View style={styles.radioDot} />}
          </View>
          <Text
            style={[
              styles.radioLabel,
              value === opt.value && styles.radioLabelActive,
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);
const CustomInput = ({ error, label, ...props }) => (
  <View style={{ marginBottom: 14 }}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      style={[styles.input, error && { borderColor: "#FF4D4F" }]}
      placeholder={label}
      placeholderTextColor="#888"
      {...props}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);
const DatePickerInput = ({
  label,
  value,
  error,
  onChange,
  onFocus,
  maximumDate,
}) => {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: 14 }}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TouchableOpacity
        onPress={() => {
          setShow(true);
          onFocus && onFocus();
        }}
        style={[styles.input, { justifyContent: "center" }]}
        activeOpacity={0.8}
      >
        <Text
          style={{
            color: value ? "#222" : "#888",
            fontSize: 16,
          }}
        >
          {value
            ? new Date(value).toLocaleDateString("vi-VN")
            : `Chọn ${label?.toLowerCase() || "ngày"}`}
        </Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
          maximumDate={maximumDate || new Date()}
        />
      )}
    </View>
  );
};
const validateSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .required("Họ và tên là bắt buộc")
    .matches(/^[\p{L}\s'-]+$/u, "Tên không được chứa ký tự đặc biệt hoặc số"),
  email: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .email("Email không hợp lệ")
    .required("Email là bắt buộc")
    .matches(
      /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Bạn phải cung cấp một địa chỉ email hợp lệ"
    ),
  phone: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  currentAddress: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .required("Địa chỉ hiện tại là bắt buộc"),
  taxCode: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .required("Mã số thuế là bắt buộc")
    .matches(/^[0-9]{10}([0-9]{3})?$/, "Mã số thuế phải gồm 10 hoặc 13 chữ số"),
  dependent: Yup.string()
    .trim()
    .required("Số người phụ thuộc là bắt buộc")
    .matches(/^[0-9]+$/, "Chỉ nhập số nguyên không âm")
    .test(
      "is-non-negative",
      "Số người phụ thuộc không được âm",
      (value) => value === undefined || value === "" || Number(value) >= 0
    ),
  gender: Yup.string().required("Giới tính là bắt buộc"),
  birthday: Yup.date().required("Ngày sinh là bắt buộc"),
  citizenIdentityCard: Yup.string()
    .matches(/^\d{9}$|^\d{12}$/, "Số CMND/CCCD phải gồm 9 hoặc 12 chữ số")
    .required("Số CMND/CCCD là bắt buộc"),
  issueDate: Yup.date().required("Ngày cấp là bắt buộc"),
  issueAt: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .required("Nơi cấp là bắt buộc"),
  nationality: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .required("Quốc tịch là bắt buộc"),
  permanentAddress: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .required("Địa chỉ thường trú là bắt buộc"),
});

const Onboard = () => {
  const scrollRef = useRef<ScrollView>(null);
  const updateUser = useUpdateUser();
  const initialValues: dtoUpdateUser = {
    fullName: "",
    email: "",
    phone: "",
    currentAddress: "",
    taxCode: "",
    dependent: "",
    gender: "M",
    birthday: null,
    citizenIdentityCard: "",
    issueDate: null,
    issueAt: "",
    nationality: "",
    permanentAddress: "",
  };

  const validate = (values: typeof initialValues) => {
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
  const handleSubmit = (values: typeof initialValues) => {
    const trimmedValues: dtoUserOnboard = {
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      currentAddress: values.currentAddress.trim(),
      taxCode: values.taxCode.trim(),
      issueAt: values.issueAt.trim(),
      nationality: values.nationality.trim(),
      permanentAddress: values.permanentAddress.trim(),
    };
    console.log("Form submitted:", trimmedValues);
    updateUser.mutate({
      userId: "13",
      onboardData: trimmedValues,
    });
  };
  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });
  const handleFocus = (inputIndex: number) => {
    scrollRef.current?.scrollTo({ y: inputIndex * 180, animated: true });
  };

  return (
    <LinearGradient colors={["#3674B5", "#2196F3"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 24 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={["#fff", "#e3eafc"]}
                style={styles.logoCircle}
              >
                <AntDesign name="idcard" size={44} color="#3674B5" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Thông tin nhân viên</Text>
            <Text style={styles.subtitle}>
              Vui lòng nhập đầy đủ thông tin để hoàn tất hồ sơ cá nhân
            </Text>
          </View>

          {/* Section 1: Thông tin liên lạc */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I. Thông tin liên lạc</Text>
            <CustomInput
              label="Họ và tên"
              error={formik.errors.fullName}
              value={formik.values.fullName}
              onChangeText={formik.handleChange("fullName")}
              onBlur={formik.handleBlur("fullName")}
              onFocus={() => handleFocus(0)}
            />
            <CustomInput
              label="Email"
              error={formik.errors.email}
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              keyboardType="email-address"
              onFocus={() => handleFocus(1)}
            />
            <CustomInput
              label="Số điện thoại"
              error={formik.errors.phone}
              value={formik.values.phone}
              onChangeText={formik.handleChange("phone")}
              onBlur={formik.handleBlur("phone")}
              keyboardType="phone-pad"
              onFocus={() => handleFocus(2)}
            />
            <CustomInput
              label="Địa chỉ hiện tại"
              value={formik.values.currentAddress}
              error={formik.errors.currentAddress}
              onChangeText={formik.handleChange("currentAddress")}
              onBlur={formik.handleBlur("currentAddress")}
              onFocus={() => handleFocus(3)}
            />
          </View>

          {/* Section 2: Thông tin thuế */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              II. Thông tin thuế & phụ thuộc
            </Text>
            <CustomInput
              label="Mã số thuế"
              value={formik.values.taxCode}
              onChangeText={formik.handleChange("taxCode")}
              error={formik.errors.taxCode}
              onBlur={formik.handleBlur("taxCode")}
              keyboardType="numeric"
              onFocus={() => handleFocus(4)}
            />
            <CustomInput
              label="Số người phụ thuộc"
              error={formik.errors.dependent}
              value={formik.values.dependent.toString()}
              onChangeText={formik.handleChange("dependent")}
              onBlur={formik.handleBlur("dependent")}
              keyboardType="numeric"
              onFocus={() => handleFocus(5)}
            />
          </View>

          {/* Section 3: Thông tin căn cước công dân */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              III. Thông tin căn cước công dân
            </Text>
            <GenderRadio
              value={formik.values.gender}
              onChange={(val: string) => formik.setFieldValue("gender", val)}
              error={formik.errors.gender}
            />
            <DatePickerInput
              label="Ngày sinh"
              value={formik.values.birthday}
              error={formik.errors.birthday}
              onChange={(date: Date | undefined) =>
                formik.setFieldValue("birthday", date)
              }
              onFocus={() => handleFocus(6)}
              maximumDate={new Date()}
            />
            <CustomInput
              label="Số CCCD"
              error={formik.errors.citizenIdentityCard}
              value={formik.values.citizenIdentityCard}
              onChangeText={formik.handleChange("citizenIdentityCard")}
              onBlur={formik.handleBlur("citizenIdentityCard")}
              keyboardType="numeric"
              onFocus={() => handleFocus(7)}
            />
            <DatePickerInput
              label="Ngày cấp"
              value={formik.values.issueDate}
              error={formik.errors.issueDate}
              onChange={(date: Date | undefined) =>
                formik.setFieldValue("issueDate", date)
              }
              onFocus={() => handleFocus(8)}
              maximumDate={new Date()}
            />
            <CustomInput
              label="Nơi cấp"
              error={formik.errors.issueAt}
              value={formik.values.issueAt}
              onChangeText={formik.handleChange("issueAt")}
              onBlur={formik.handleBlur("issueAt")}
              onFocus={() => handleFocus(9)}
            />
            <CustomInput
              label="Quốc tịch"
              error={formik.errors.nationality}
              value={formik.values.nationality}
              onChangeText={formik.handleChange("nationality")}
              onBlur={formik.handleBlur("nationality")}
              onFocus={() => handleFocus(10)}
            />
            <CustomInput
              label="Địa chỉ thường trú"
              error={formik.errors.permanentAddress}
              value={formik.values.permanentAddress}
              onChangeText={formik.handleChange("permanentAddress")}
              onBlur={formik.handleBlur("permanentAddress")}
              onFocus={() => handleFocus(11)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={formik.submitForm}>
            <View style={styles.buttonGradient}>
              {updateUser.isPending ? (
                <ActivityIndicator size="small" color="#3674B5" />
              ) : (
                <Text style={styles.buttonText}>Lưu thông tin</Text>
              )}
              {updateUser.isError && (
                <Text style={styles.errorText}>
                  Có lỗi xảy ra. Vui lòng thử lại.
                </Text>
              )}
              {updateUser.isSuccess && (
                <Text style={{ color: "#52c41a", marginTop: 4 }}>
                  Cập nhật thông tin thành công!
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    justifyContent: "flex-start",
  },
  header: {
    alignItems: "center",
    marginTop: 48,
    marginBottom: 16,
  },
  logoWrapper: {
    marginBottom: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.08)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 12,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#3674B5",
    marginBottom: 12,
    marginLeft: 2,
    letterSpacing: 0.2,
  },
  inputLabel: {
    fontSize: 15,
    color: "#3674B5",
    fontWeight: "500",
    marginBottom: 4,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f7faff",
    color: "#222",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 14,
    backgroundColor: "#f7faff",
    overflow: "hidden",
  },
  picker: {
    height: 48,
    width: "100%",
  },
  button: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  buttonGradient: {
    backgroundColor: "#fff",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "100%",
  },
  buttonText: {
    color: "#3674B5",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 0.5,
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 13,
    marginTop: 2,
    marginLeft: 2,
  },
  genderRadioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginTop: 2,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
    paddingVertical: 4,
  },
  radioButtonActive: {},
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#3674B5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  radioCircleActive: {
    borderColor: "#3674B5",
    backgroundColor: "#e3eafc",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3674B5",
  },
  radioLabel: {
    color: "#3674B5",
    fontSize: 16,
    fontWeight: "500",
  },
  radioLabelActive: {
    color: "#3674B5",
    fontWeight: "bold",
  },
});

export default Onboard;
