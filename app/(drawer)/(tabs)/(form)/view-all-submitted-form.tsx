import { useGetSubmittedForm } from "@/hooks/useGetSubmittedForm";
import { store } from "@/lib/store";
import { AntDesign, FontAwesome, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  RefreshControl,
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
  const state = store.getState();
  const userProfile = state.auth?.userProfile;
  const userId = userProfile?.id;

  // State management
  const [allSubmittedFormList, setAllSubmittedFormList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "ACCEPTED" | "REJECTED"
  >("ALL");
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  // Refs
  const scrollYRef = useRef(0);
  const hasLoadedInitial = useRef(false);

  // Fetch data with current page
  const { submittedFormListData, refetch, isFetching } = useGetSubmittedForm({
    userId: userId || "",
    offset: page * 10,
    enabled: true,
  });

  // Initial load - only runs once when component mounts
  useEffect(() => {
    if (!hasLoadedInitial.current && submittedFormListData?.data) {
      console.log("Initial data loaded:", submittedFormListData.data);
      console.log(
        "Sample form statuses:",
        submittedFormListData.data.map((f: any) => f.status),
      );
      setAllSubmittedFormList(submittedFormListData.data);
      hasLoadedInitial.current = true;
    }
  }, [submittedFormListData]);

  // Load more data when page changes (excluding initial load)
  const loadMoreData = useCallback(async () => {
    if (isLoadingMore || page === 0) return;

    setIsLoadingMore(true);
    try {
      const result = await refetch();
      if (result?.data?.data && Array.isArray(result.data.data)) {
        const newData = result.data.data;

        // Only append if we got new data
        if (newData.length > 0) {
          setAllSubmittedFormList((prev) => {
            // Filter out duplicates based on ID
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewData = newData.filter(
              (item: any) => !existingIds.has(item.id),
            );
            return [...prev, ...uniqueNewData];
          });
        }
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, isLoadingMore, refetch]);

  // Trigger load more when page changes
  useEffect(() => {
    if (page > 0 && hasLoadedInitial.current) {
      loadMoreData();
    }
  }, [page]);

  const handleRefresh = useCallback(async () => {
    if (isRefresh) return;

    setIsRefresh(true);
    try {
      // Reset pagination and internal flags
      hasLoadedInitial.current = false;
      
      // Reset to page 0 first
      setPage(0);
      
      // Refetch with explicit offset=0 to get fresh data from the beginning
      const result = await refetch();
      if (result?.data?.data && Array.isArray(result.data.data)) {
        setAllSubmittedFormList(result.data.data);
        hasLoadedInitial.current = true;
      } else {
        setAllSubmittedFormList([]);
      }
    } catch (error) {
      console.error("Error refreshing submitted forms:", error);
    } finally {
      setIsRefresh(false);
    }
  }, [isRefresh, refetch]);

  // Handle scroll end - only when scrolling down
  const handleScrollEnd = useCallback(
    ({ nativeEvent }: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const currentScrollY = contentOffset.y;
      const paddingToBottom = 20;

      // Check if scrolling down
      const isScrollingDown = currentScrollY > scrollYRef.current;

      // Check if at bottom
      const isAtBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      // Only trigger when scrolling down AND at bottom AND not already loading
      if (isScrollingDown && isAtBottom && !isLoadingMore) {
        console.log("Scrolled down to the bottom! Loading more...");
        setPage((prev) => prev + 1);
      }

      // Update previous scroll position
      scrollYRef.current = currentScrollY;
    },
    [isLoadingMore],
  );

  const formList: any[] = Array.isArray(allSubmittedFormList)
    ? allSubmittedFormList
    : [];

  // Filter and search forms
  const filteredForms = useMemo(() => {
    if (!formList.length) return [];

    return formList.filter((form) => {
      const matchesSearch =
        form?.formCategoryTitle
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        form?.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;

      // Normalize status for comparison (handle case sensitivity and trim whitespace)
      const formStatus = (form?.status || "").toString().toUpperCase().trim();
      const matchesStatus =
        filterStatus === "ALL" ||
        formStatus === filterStatus.toUpperCase().trim();

      return matchesSearch && matchesStatus;
    });
  }, [formList, searchQuery, filterStatus]);

  // Count by status
  const statusCounts = useMemo(() => {
    if (!formList.length) {
      return {
        all: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
      };
    }

    return {
      all: formList.length,
      pending: formList.filter((f) => {
        const status = (f?.status || "").toString().toUpperCase().trim();
        return status === "PENDING";
      }).length,
      accepted: formList.filter((f) => {
        const status = (f?.status || "").toString().toUpperCase().trim();
        return status === "ACCEPTED";
      }).length,
      rejected: formList.filter((f) => {
        const status = (f?.status || "").toString().toUpperCase().trim();
        return status === "REJECTED";
      }).length,
    };
  }, [formList]);

  // Render status
  const renderStatus = useCallback((status: any) => {
    if (status === "PENDING") {
      return "Chờ duyệt";
    } else if (status === "ACCEPTED") {
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
              filterStatus === "ACCEPTED" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("ACCEPTED")}
          >
            <View
              style={[styles.filterChipDot, { backgroundColor: "#4CAF50" }]}
            />
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "ACCEPTED" && styles.filterChipTextActive,
              ]}
            >
              Đã duyệt ({statusCounts.accepted})
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
        onMomentumScrollEnd={handleScrollEnd}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.content}>
          {filteredForms.length > 0 ? (
            <>
              {filteredForms.map((form, index) => (
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
                              : form.status === "ACCEPTED"
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
                            : form.status === "ACCEPTED"
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
                          {new Date(form.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
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
              ))}
              {isFetching && (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size="small" color="#3674B5" />
                  <Text style={styles.loadingMoreText}>
                    Đang tải thêm đơn...
                  </Text>
                </View>
              )}
            </>
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
    marginBottom: 80,
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
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
    flexDirection: "row",
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
});
