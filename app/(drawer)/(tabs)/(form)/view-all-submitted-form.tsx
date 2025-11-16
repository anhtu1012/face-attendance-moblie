import { AntDesign, FontAwesome, Octicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const handleRenderFormStateModern = (form: any) => {
  if (form.status === "PENDING") {
    return (
      <View style={styles.modernStatusBadge}>
        <View
          style={[styles.statusDotIndicator, { backgroundColor: "#FF9800" }]}
        />
        <Text style={[styles.modernStatusText, { color: "#FF9800" }]}>
          Chờ duyệt
        </Text>
      </View>
    );
  } else if (form.status === "REJECTED") {
    return (
      <View style={styles.modernStatusBadge}>
        <View
          style={[styles.statusDotIndicator, { backgroundColor: "#F44336" }]}
        />
        <Text style={[styles.modernStatusText, { color: "#F44336" }]}>
          Từ chối
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.modernStatusBadge}>
      <View
        style={[styles.statusDotIndicator, { backgroundColor: "#4CAF50" }]}
      />
      <Text style={[styles.modernStatusText, { color: "#4CAF50" }]}>
        Đã duyệt
      </Text>
    </View>
  );
};

export default function ChooseFormPage() {
  const { submittedForms } = useLocalSearchParams();
  const formList: any[] = JSON.parse(submittedForms as string);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");

  // Filter and search forms
  const filteredForms = useMemo(() => {
    return formList.filter((form) => {
      const matchesSearch =
        form.formCategoryTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        form.reason?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "ALL" || form.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [formList, searchQuery, filterStatus]);

  // Count by status
  const statusCounts = useMemo(() => {
    return {
      all: formList.length,
      pending: formList.filter((f) => f.status === "PENDING").length,
      approved: formList.filter((f) => f.status === "APPROVED").length,
      rejected: formList.filter((f) => f.status === "REJECTED").length,
    };
  }, [formList]);

  // Render status
  const renderStatus = useCallback((status: any) => {
    if (status === "PENDING") {
      return "Chờ duyệt";
    } else if (status === "APPROVED") {
      return "Đã duyệt";
    } else if (status === "REJECTED") {
      return "Từ chối";
    }
    return "Tất cả";
  }, []);

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.replace("/")}
            style={styles.backButton}
          >
            <AntDesign name="left" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Đơn đã nộp</Text>
            <Text style={styles.headerSubtitle}>
              {filteredForms.length} đơn{" "}
              {filterStatus !== "ALL" ? `(${renderStatus(filterStatus)})` : ""}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            size={18}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đơn..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <AntDesign name="close" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "ALL" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("ALL")}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "ALL" && styles.filterChipTextActive,
              ]}
            >
              Tất cả ({statusCounts.all})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "PENDING" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("PENDING")}
          >
            <View
              style={[styles.filterChipDot, { backgroundColor: "#FF9800" }]}
            />
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "PENDING" && styles.filterChipTextActive,
              ]}
            >
              Chờ duyệt ({statusCounts.pending})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "APPROVED" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("APPROVED")}
          >
            <View
              style={[styles.filterChipDot, { backgroundColor: "#4CAF50" }]}
            />
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "APPROVED" && styles.filterChipTextActive,
              ]}
            >
              Đã duyệt ({statusCounts.approved})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "REJECTED" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("REJECTED")}
          >
            <View
              style={[styles.filterChipDot, { backgroundColor: "#F44336" }]}
            />
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "REJECTED" && styles.filterChipTextActive,
              ]}
            >
              Từ chối ({statusCounts.rejected})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Form list*/}
      <ScrollView
        style={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {filteredForms.length > 0 ? (
            filteredForms.map((form, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modernFormItem,
                  index !== filteredForms.length - 1 && styles.formItemBorder,
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/(form)/form-detail",
                    params: { ...form },
                  })
                }
                activeOpacity={0.7}
              >
                {/* Left Side - Icon and Info */}
                <View style={styles.formItemLeft}>
                  <View
                    style={[
                      styles.modernFormIcon,
                      {
                        backgroundColor:
                          form.status === "PENDING"
                            ? "#FFF4E6"
                            : form.status === "APPROVED"
                              ? "#E8F5E9"
                              : "#FFEBEE",
                      },
                    ]}
                  >
                    <Octicons
                      name="file"
                      size={20}
                      color={
                        form.status === "PENDING"
                          ? "#FF9800"
                          : form.status === "APPROVED"
                            ? "#4CAF50"
                            : "#F44336"
                      }
                    />
                  </View>

                  <View style={styles.formItemContent}>
                    <Text style={styles.modernFormTitle} numberOfLines={1}>
                      {form.formCategoryTitle}
                    </Text>
                    <View style={styles.formDateContainer}>
                      <AntDesign name="clock-circle" size={12} color="#999" />
                      <Text style={styles.modernFormDate}>
                        {new Date(form.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right Side - Status Badge */}
                <View style={styles.formItemRight}>
                  {handleRenderFormStateModern(form)}
                  <AntDesign
                    name="right"
                    size={16}
                    color="#ccc"
                    style={styles.formArrow}
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconContainer}>
                <Octicons name="inbox" size={64} color="#ccc" />
              </View>
              <Text style={styles.emptyStateTitle}>
                {searchQuery ? "Không tìm thấy đơn" : "Chưa có đơn nào"}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery
                  ? `Không có đơn nào phù hợp với "${searchQuery}"`
                  : "Các đơn bạn nộp sẽ hiển thị ở đây"}
              </Text>
            </View>
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
    marginBottom: 70,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
    padding: 0,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterContent: {
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#3674B5",
  },
  filterChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  content: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modernFormItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  formItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  formItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  modernFormIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  formItemContent: {
    flex: 1,
    justifyContent: "center",
  },
  modernFormTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  formDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modernFormDate: {
    fontSize: 13,
    color: "#999",
  },
  formItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modernStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    gap: 4,
  },
  statusDotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modernStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  formArrow: {
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});
