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
import { styles } from "./choose-form.styles";

export default function ChooseFormPage() {
  return (
    <View style={styles.container}>
      {/* header */}
      <CustomHeaders title="Chọn loại đơn" onBack={() => router.replace("/")} />
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
