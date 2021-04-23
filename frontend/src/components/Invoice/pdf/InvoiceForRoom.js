import { Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  table: {
    marginBottom: "40px",
  },
  h3: {
    color: "#455D58",
    fontSize: "12px",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  container: {
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 40,
    flexGrow: 1,
  },
  lastContainer: {
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 40,
    flexGrow: 1,
    backgroundColor: "#f7f7f7"
  },
  no: { width: "15%" },
  type: { width: "50%" },
  days: { width: "10%" },
  amount: { width: "25%" },
  total: { width: "15%"},
  totalHeading: { width: "75%", padding: "0 10px" },
  totalBill: {height: 40, color: "#000", padding: "5px 0"}
});

function InvoiceForRoom({ roomBills, rbill }) {
  return (
    <View style={styles.table}>
      <View>
        <Text style={styles.h3}>Room Bills</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.no}>Room no</Text>
        <Text style={styles.type}>Room type</Text>
        <Text style={styles.days}>Days</Text>
        <Text style={styles.amount}>Amount</Text>
      </View>
      {roomBills &&
        roomBills.map((data) => (
          <View style={styles.container} key={data.id}>
            <Text style={styles.no}>#{data.room_num}</Text>
            <Text style={styles.type}>{data.room_type}</Text>
            <Text style={styles.days}>
              {data.stayed} {data.stayed > 1 ? "days" : "day"}
            </Text>
            <Text style={styles.amount}>{data.rate}tk</Text>
          </View>
        ))}

        <View style={styles.lastContainer}>
          <Text style={styles.totalHeading}>TOTAL</Text>
          <Text style={styles.totalBill}>{rbill.total_bills}tk</Text>
        </View>
    </View>
  );
}

export default InvoiceForRoom;