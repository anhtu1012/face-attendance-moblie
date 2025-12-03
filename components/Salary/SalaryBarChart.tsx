import { dailySalaryData } from "@/models/salary/dtoSalary";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Eye, EyeOff } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

interface SalaryBarChartProps {
  data: dailySalaryData[];
  showSalary?: boolean;
  onToggleVisibility?: () => void;
}

const SalaryBarChart: React.FC<SalaryBarChartProps> = ({
  data,
  showSalary = false,
  onToggleVisibility,
}) => {
  const screenWidth = Dimensions.get("window").width;

  // Format number with Vietnamese comma separator
  const formatCurrency = (amount: number) => {
    if (!showSalary) {
      return "********";
    }
    return new Intl.NumberFormat("vi-VN").format(Math.round(amount));
  };

  // Format compact for quick stats (shorter version)
  const formatCompact = (amount: number) => {
    if (!showSalary) {
      return "***";
    }
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  // Format for chart display (shorter version)
  const formatChartValue = (value: number) => {
    if (!showSalary) {
      return "***";
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="chart-bar" size={48} color="#D1D5DB" />
        <Text style={styles.emptyText}>Chưa có dữ liệu lương</Text>
      </View>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const labels = data.map((item) => {
    const date = new Date(item.date);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  });

  const salaryData = data.map((item) =>
    item.totalSalary ? item.totalSalary : 0
  );

  const maxSalary = Math.max(...salaryData);
  const minSalary = Math.min(...salaryData);
  const totalSalary = salaryData.reduce((a, b) => a + b, 0);
  const avgSalary = totalSalary / salaryData.length;

  // Count days with OT and fines
  const daysWithOT = data.filter((item) => item.hasOT).length;
  const daysWithFine = data.filter((item) => item.totalFine > 0).length;

  return (
    <View style={styles.container}>
      {/* Header with icon */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="chart-bar"
              size={20}
              color="#3674B5"
            />
          </View>
          <View>
            <Text style={styles.title}>Biểu đồ lương theo ngày</Text>
            <Text style={styles.subtitle}>Đơn vị: Đồng (VND)</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats Bar */}
      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatValue}>{data.length}</Text>
          <Text style={styles.quickStatLabel}>Ngày</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Text style={[styles.quickStatValue, { color: "#10B981" }]}>
            {formatCompact(avgSalary)}
          </Text>
          <Text style={styles.quickStatLabel}>TB</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItemWithIcon}>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatValue, { color: "#3674B5" }]}>
              {formatCompact(totalSalary)}
            </Text>
            <Text style={styles.quickStatLabel}>Tổng</Text>
          </View>
          {onToggleVisibility && (
            <TouchableOpacity
              onPress={onToggleVisibility}
              style={styles.eyeIconButtonInline}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showSalary ? (
                <Eye size={18} color="#3674B5" />
              ) : (
                <EyeOff size={18} color="#3674B5" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Chart */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels,
              datasets: [
                {
                  data: salaryData.length > 0 ? salaryData : [0],
                },
              ],
            }}
            width={Math.max(screenWidth - 40, data.length * 60)}
            height={240}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FAFBFC",
              decimalPlaces: 0,
              color: (opacity = 1) => {
                return `rgba(54, 116, 181, ${opacity})`;
              },
              labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeWidth: 1,
                stroke: "#E5E7EB",
              },
              propsForLabels: {
                fontSize: 10,
                fontWeight: "600",
              },
              barPercentage: 0.65,
              formatTopBarValue: (value: number) => formatChartValue(value),
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            withInnerLines
            segments={5}
          />
        </View>
      </ScrollView>

      {/* Insights */}
      {(daysWithOT > 0 || daysWithFine > 0) && (
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Thông tin thêm</Text>
          <View style={styles.insightsRow}>
            {daysWithOT > 0 && (
              <View style={styles.insightBadge}>
                <MaterialCommunityIcons
                  name="clock-plus-outline"
                  size={14}
                  color="#F59E0B"
                />
                <Text style={styles.insightText}>{daysWithOT} ngày có OT</Text>
              </View>
            )}
            {daysWithFine > 0 && (
              <View
                style={[styles.insightBadge, { backgroundColor: "#FEE2E2" }]}
              >
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={14}
                  color="#EF4444"
                />
                <Text style={[styles.insightText, { color: "#DC2626" }]}>
                  {daysWithFine} ngày có phạt
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Detailed Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconBox}>
            <MaterialCommunityIcons
              name="trending-up"
              size={18}
              color="#10B981"
            />
          </View>
          <Text style={styles.statLabel}>Cao nhất</Text>
          <Text style={[styles.statValue, { color: "#10B981" }]}>
            {formatCurrency(maxSalary)}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#EFF6FF" }]}>
          <View style={[styles.statIconBox, { backgroundColor: "#DBEAFE" }]}>
            <MaterialCommunityIcons
              name="chart-line"
              size={18}
              color="#3674B5"
            />
          </View>
          <Text style={styles.statLabel}>Trung bình</Text>
          <Text style={[styles.statValue, { color: "#3674B5" }]}>
            {formatCurrency(avgSalary)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconBox}>
            <MaterialCommunityIcons
              name="trending-down"
              size={18}
              color="#EF4444"
            />
          </View>
          <Text style={styles.statLabel}>Thấp nhất</Text>
          <Text style={[styles.statValue, { color: "#EF4444" }]}>
            {formatCurrency(minSalary)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SalaryBarChart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 12,
    fontWeight: "500",
  },
  header: {
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "space-around",
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
  },
  quickStatItemWithIcon: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quickStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
  quickStatValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 2,
    textAlign: "center",
  },
  quickStatLabel: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "600",
    textAlign: "center",
  },
  eyeIconButtonInline: {
    padding: 4,
  },
  scrollContent: {
    paddingRight: 16,
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  chart: {
    borderRadius: 12,
    paddingRight: 0,
  },
  insightsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  insightsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  insightsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  insightBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  insightText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D97706",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "600",
    textAlign: "center",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    flexWrap: "wrap",
  },
});
