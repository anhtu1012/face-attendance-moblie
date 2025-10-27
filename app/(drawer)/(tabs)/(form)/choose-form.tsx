import CustomHeaders from "@/components/ui/CustomHeaders";
import { formTypes } from "@/constants/form";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChooseFormPage() {
  return (
    <View style={styles.container}>
      <CustomHeaders title="Tạo mới đơn từ" onBack={() => router.navigate("/(drawer)/(tabs)")} />
      <ScrollView style={[styles.scrollViewContainer]}>
        <View style={styles.content}>
          <View style={styles.formTypesGrid}>
            {formTypes.map((formType) => (
              <TouchableOpacity
                key={formType.id}
                style={styles.formTypeCard}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/(form)/create-form",
                    params: { ...formType },
                  })
                }
              >
                <LinearGradient
                  colors={[formType.color, `${formType.color}CC`]}
                  style={styles.formTypeIcon}
                >
                  <AntDesign
                    name={formType.icon as any}
                    size={24}
                    color={formType.iconColor}
                  />
                </LinearGradient>
                <View style={{ marginLeft: "5%", width: "70%" }}>
                  <Text style={styles.formTypeTitle}>{formType.title}</Text>
                  <Text style={styles.formTypeDescription}>
                    {formType.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
});
