import { DailySalary } from "@/models/salary/dtoSalary";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface SalaryBarChartProps {
  data: DailySalary[];
}

const SalaryBarChart: React.FC<SalaryBarChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get("window").width;

  if (!data || data.length === 0) {
    return null;
  }

  // Prepare chart data - take only first 10 days for readability
  const chartData = data;

  const labels = chartData.map((item) => {
    const date = new Date(item.date);
    const dayOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
    return `${date.getDate()}/${dayOfWeek}`;
  });

  const salaryData = chartData.map((item) => item.totalSalary / 1000000); // Convert to millions
  const otData = chartData.map((item) => item.otSalary / 1000000);
  const fineData = chartData.map((item) => item.totalFine / 1000);

  const maxSalary = Math.max(...salaryData);
  const yAxisMax = Math.ceil(maxSalary / 0.5) * 0.5; // Round up to nearest 0.5M

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Biểu đồ lương</Text>
        <Text style={styles.subtitle}>Đơn vị: Triệu đồng</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels,
              datasets: [
                {
                  data: salaryData,
                },
              ],
            }}
            width={Math.max(screenWidth - 40, chartData.length * 50)}
            height={220}
            yAxisLabel=""
            yAxisSuffix="M"
            fromZero
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#F9FAFB",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeDasharray: "",
                stroke: "#E5E7EB",
                strokeWidth: 1,
              },
              propsForLabels: {
                fontSize: 11,
                fontWeight: "600",
              },
              barPercentage: 0.7,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            withInnerLines
            segments={4}
          />
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
          <Text style={styles.legendText}>Tổng lương</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
          <Text style={styles.legendText}>Có OT</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
          <Text style={styles.legendText}>Có phạt</Text>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Trung bình</Text>
          <Text style={styles.statValue}>
            {(
              salaryData.reduce((a, b) => a + b, 0) / salaryData.length
            ).toFixed(1)}
            M
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Cao nhất</Text>
          <Text style={[styles.statValue, { color: "#10B981" }]}>
            {Math.max(...salaryData).toFixed(1)}M
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Thấp nhất</Text>
          <Text style={[styles.statValue, { color: "#EF4444" }]}>
            {Math.min(...salaryData).toFixed(1)}M
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
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  chartContainer: {
    alignItems: "center",
  },
  chart: {
    borderRadius: 16,
    paddingRight: 0,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
});
