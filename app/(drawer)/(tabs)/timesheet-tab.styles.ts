import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  customHeader: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3674B5",
  },
  scrollViewContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 10,
    paddingBottom: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});
