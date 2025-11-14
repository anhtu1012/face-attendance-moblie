import CustomHeaders from "@/components/ui/CustomHeaders";
import { formTypes } from "@/constants/form";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
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
      
      <ScrollView 
        style={[styles.scrollViewContainer]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header Description */}
          <View style={styles.headerDescription}>
            <MaterialCommunityIcons name="file-document-edit" size={28} color="#3674B5" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerDescTitle}>Tạo đơn mới</Text>
              <Text style={styles.headerDescSubtitle}>
                Chọn loại đơn phù hợp với nhu cầu của bạn
              </Text>
            </View>
          </View>

          {/* Form Types Grid */}
          <View style={styles.formTypesGrid}>
            {formTypes.map((formType, index) => (
              <TouchableOpacity
                key={formType.id}
                style={[
                  styles.formTypeCard,
                  index === formTypes.length - 1 && styles.lastCard
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/(form)/create-form",
                    params: { ...formType },
                  })
                }
                activeOpacity={0.7}
              >
                {/* Gradient Background Accent */}
                <LinearGradient
                  colors={formType.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardAccent}
                />
                
                {/* Icon Container */}
                <View style={[styles.formTypeIconContainer, { backgroundColor: formType.color }]}>
                  <LinearGradient
                    colors={formType.gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconGradient}
                  >
                    <AntDesign
                      name={formType.icon as any}
                      size={28}
                      color="#fff"
                    />
                  </LinearGradient>
                </View>

                {/* Content */}
                <View style={styles.formTypeContent}>
                  <Text style={styles.formTypeTitle}>{formType.title}</Text>
                  <Text style={styles.formTypeDescription} numberOfLines={2}>
                    {formType.description}
                  </Text>
                </View>

                {/* Arrow Icon */}
                <AntDesign name="right" size={20} color="#999" style={styles.arrowIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
