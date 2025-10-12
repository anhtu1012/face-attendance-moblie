import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function MultiFileInput() {
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true, // ✅ allow multiple selection
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      // Append selected files to existing list
      setFiles((prev) => [...prev, ...result.assets]);
      console.log("Picked files:", result.assets);
    } catch (error) {
      console.error("Error picking files:", error);
    }
  };

  const removeFile = (uri: string) => {
    setFiles((prev) => prev.filter((f) => f.uri !== uri));
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
        Tệp <Text style={{ color: "red" }}>*</Text>
      </Text>

      <TouchableOpacity
        onPress={pickFiles}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          backgroundColor: "#f9f9f9",
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "#333" }}>Chọn tệp...</Text>
      </TouchableOpacity>

      {files.length > 0 && (
        <FlatList
          data={files}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#333",
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => removeFile(item.uri)}>
                <Text style={{ color: "red", marginLeft: 10 }}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
