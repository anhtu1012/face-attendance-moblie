import { Entypo, AntDesign, Octicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FormDetail } from "..";

const handleRenderFormState = (form: FormDetail) => {
  if (form.status == "PENDING") {
    return (
      <View
        style={[
          styles.tickContainer,
          {
            backgroundColor: "rgba(255, 180, 10, 0.1)",
          },
        ]}
      >
        <AntDesign
          name="clock-circle"
          size={16}
          color="#ffb40a"
          style={{ marginRight: 3 }}
        />
        <Text style={{ color: "#ffb40a" }}>Đang chờ</Text>
      </View>
    );
  } else if (form.status == "REJECTED")
    return (
      <View
        style={[
          styles.tickContainer,
          {
            backgroundColor: "rgba(242, 95, 108, 0.1)",
          },
        ]}
      >
        <Entypo name="circle-with-cross" size={16} color="#f25f6c" />
        <Text style={{ color: "#f25f6c" }}>Từ chối</Text>
      </View>
    );

  return (
    <View
      style={[
        styles.tickContainer,
        {
          backgroundColor: "rgba(96, 208, 152, 0.1)",
        },
      ]}
    >
      <Entypo name="check" size={16} color="#60d098" />
      <Text style={{ color: "#60d098" }}>Đã duyệt</Text>
    </View>
  );
};

export default function ChooseFormPage() {
  const { submittedForms } = useLocalSearchParams();
  const formList: FormDetail[] = JSON.parse(submittedForms as string);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.replace("/")}>
            <AntDesign
              name="arrow-left"
              size={24}
              color="#919296"
              style={styles.goBackArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tất cả đơn đã nộp</Text>
        </View>
      </View>
      {/* Form list*/}
      <ScrollView style={[styles.scrollViewContainer]}>
        <View style={styles.content}>
          {formList.length > 0 ? (
            formList.map((form, index) => (
              <TouchableOpacity
                key={index}
                style={styles.eventItem}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/(form)/form-detail",
                    params: { ...form },
                  })
                }
              >
                <View style={styles.eventIconContainer}>
                  <Octicons
                    name="paperclip"
                    size={24}
                    color="#3674B5"
                    style={{ marginVertical: "auto" }}
                  />
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>
                    {form.formCategoryTitle}
                  </Text>
                  <Text style={styles.eventTime}>
                    {new Date(form.createdAt).toDateString()}
                  </Text>
                </View>
                {handleRenderFormState(form)}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noSubmittedFormText}>
              Không có đơn để hiển thị
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  goBackArrow: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  formTypesGrid: {
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  formTypeCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    // elevation: 1,
    borderColor: "#e8eaef",
    borderWidth: 1,
    position: "relative",
  },
  selectedFormType: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  formTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  formTypeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    // textAlign: "center",
    marginBottom: 5,
  },
  formTypeDescription: {
    fontSize: 12,
    color: "#666",
    // textAlign: "center",
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  viewFormsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  viewFormsButtonText: {
    color: "#3674B5",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  tickContainer: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    gap: 3,
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: 5,
  },
  eventItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  eventIconContainer: {
    marginRight: 12,
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  eventTime: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  noSubmittedFormText: {
    fontStyle: "italic",
  },
});
