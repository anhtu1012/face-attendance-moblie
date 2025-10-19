import React, { Dispatch, SetStateAction } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";

export default function MultiFileInput({
  files,
  setFiles,
}: {
  files: DocumentPicker.DocumentPickerAsset[];
  setFiles: Dispatch<SetStateAction<DocumentPicker.DocumentPickerAsset[]>>;
}) {
  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      setFiles((prev) => [...prev, ...result.assets]);
    } catch (error) {
      console.error("Error picking files:", error);
    }
  };

  const removeFile = (uri: string) => {
    setFiles((prev) => prev.filter((f) => f.uri !== uri));
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: "dotted",
        borderRadius: 8,
        backgroundColor: "#fafafa",
        paddingHorizontal: 8,
        paddingTop: 5,
      }}
    >
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Đính kèm</Text>

      {/* Select file button */}
      <TouchableOpacity
        onPress={pickFiles}
        style={{
          justifyContent: "center",
          gap: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          backgroundColor: "#3674B5",
          marginBottom: 2,
          flexDirection: "row",
        }}
      >
        <FontAwesome name="paper-plane" size={15} color="white" />
        <Text style={{ color: "white" }}>Chọn tệp từ máy</Text>
      </TouchableOpacity>

      {files.length > 0 ? (
        <Text style={{ fontStyle: "italic", fontSize: 11 }}>
          Đã chọn {files.length} tệp
        </Text>
      ) : (
        <Text></Text>
      )}
      {/* Scrollable file list with fixed height */}
      <View
        style={{
          minHeight: 70,
          maxHeight: 70,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={true}>
          {files.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Feather
                name="file-text"
                size={18}
                color="#555"
                style={{ marginRight: 5 }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#007AFF",
                  textDecorationLine: "underline",
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => removeFile(item.uri)}>
                <AntDesign
                  name="delete"
                  size={18}
                  color="#f25f6c"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
