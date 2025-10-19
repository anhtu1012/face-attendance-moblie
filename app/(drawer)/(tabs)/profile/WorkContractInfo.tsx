import PDFModal from "@/components/ui/PDFModal";
import { dtoUpdateUser } from "@/models/auth/dtoUser";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WorkContractInfoProps {
  userData: dtoUpdateUser | undefined;
}

type ContractPreview = {
  id: string;
  contractType: string;
  laborType: string; 
  position: string; 
  startDate: Date;
  endDate: Date;
  pdfUrl: string;
};

const WorkContractInfo: React.FC<WorkContractInfoProps> = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<dtoUpdateUser>(
    userData as dtoUpdateUser
  );
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  // Mock data: 2 hợp đồng, sắp xếp theo thời gian gần nhất (startDate desc)
  const mockContracts: ContractPreview[] = useMemo(
    () =>
      [
        {
          id: "hd-002",
          contractType: "HĐLĐ xác định thời hạn",
          laborType: "Toàn thời gian",
          position: "Front-end Developer",
          startDate: new Date("2024-05-15"),
          endDate: new Date("2025-05-14"),
          pdfUrl: "https://nhanchinh.vn/storage/files/5/Hop-dong-lao-dong.pdf",
        },
        {
          id: "hd-001",
          contractType: "HĐLĐ thử việc",
          laborType: "Toàn thời gian",
          position: "Back-end Developer",
          startDate: new Date("2024-03-01"),
          endDate: new Date("2024-05-01"),
          pdfUrl: "https://nhanchinh.vn/storage/files/5/Hop-dong-lao-dong.pdf",
        },
      ].sort((a, b) => b.startDate.getTime() - a.startDate.getTime()),
    []
  );

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);

  const getDuration = (start: Date, end: Date) => {
    const ms = end.getTime() - start.getTime();
    if (ms <= 0) return "0 ngày";
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    if (months >= 1) return `${months} tháng`;
    return `${days} ngày`;
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerActions}>
        <Text style={styles.sectionTitle}>Lịch sử hợp đồng</Text>
      </View>

      {/* Contract List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {mockContracts.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => {
              setSelectedPdfUrl(c.pdfUrl);
              setIsVisible(true);
              setTitle(c.contractType);
            }}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>{c.contractType}</Text>
              <Text style={styles.cardBadge}>{c.laborType}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Vị trí</Text>
              <Text style={styles.metaValue}>{c.position}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Bắt đầu</Text>
              <Text style={styles.metaValue}>{formatDate(c.startDate)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Kết thúc</Text>
              <Text style={styles.metaValue}>{formatDate(c.endDate)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Thời hạn</Text>
              <Text style={styles.metaHighlight}>
                {getDuration(c.startDate, c.endDate)}
              </Text>
            </View>
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Xem hợp đồng</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* PDF Modal */}
      <PDFModal
        isVisible={isVisible}
        title={title}
        pdfUrl={"https://nhanchinh.vn/storage/files/5/Hop-dong-lao-dong.pdf"}
        onClose={() => setIsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    flexShrink: 1,
    paddingRight: 8,
  },
  cardBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563eb",
    backgroundColor: "#e0edff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  metaLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  metaValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  metaHighlight: {
    fontSize: 14,
    color: "#0f766e",
    fontWeight: "700",
  },
  linkRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  linkText: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerActionButtonEdit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  headerActionButtonEditText: {
    color: "#3674B5",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerActionButtonSave: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D69E2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerActionButtonSaveText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerActionButtonCancel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E53E3E",
  },
  headerActionButtonCancelText: {
    color: "#E53E3E",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: "center",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
});

export default WorkContractInfo;
