import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LeaderboardData } from "../interfaces/leaderboardData";
import { fetchLeaderboard, refreshVendorRank } from "../controllers/leaderboardController";


const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
  const router = useRouter();

  function getArrow(change: string) {
  if (change === "Up") {
    return (
      <MaterialIcons name="keyboard-arrow-up" size={24} color="#22C55E" style={{ marginTop: 2 }} />
    );
  } else if (change === "Down") {
    return (
      <MaterialIcons name="keyboard-arrow-down" size={24} color="#EF4444" style={{ marginTop: 2 }} />
    );
  } else {
    return null;
  }
}

  const refreshLeaderboard = async () => {
    setRefreshing(true);
    await refreshVendorRank();
    const data = await fetchLeaderboard();
    if (data) setLeaderboardData(data);
    setRefreshing(false);
  };

  useEffect(() => {
    const loadInitialLeaderboard = async () => {
      setLoading(true);
      await refreshVendorRank();
      const data = await fetchLeaderboard();
      if (data) setLeaderboardData(data);
      setLoading(false);
    };
    loadInitialLeaderboard();
  }, []);

  if (loading) {
    return <Text style={{ textAlign: "center", marginTop: 32 }}>Loading leaderboard...</Text>;
  }

  const renderTopThreeVendors = () => {
    const topThree = leaderboardData.slice(0, 3);
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 24, paddingHorizontal: 8 }}>
        {topThree.map((vendor, idx) => (
          <View
            key={vendor.vendor_id}
            style={{
              alignItems: "center",
              width: "30%",
              transform: [{ scale: idx === 0 ? 1.1 : 1 }],
            }}
          >
            <View
              style={{
                position: "absolute",
                top: -5,
                left: 8,
                width: 32,
                height: 32,
                backgroundColor: "#FFEB3B",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>{idx + 1}</Text>
            </View>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Image
                source={{ uri: vendor.imageUrl || "https://via.placeholder.com/150" }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
            </View>
            <Text style={{ fontWeight: "bold", color: "#fff", textAlign: "center" }}>{vendor.vendor_name}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>{vendor.vendor_green_score}%</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#8BC34A" }}>
      <StatusBar barStyle="light-content" backgroundColor="#8BC34A" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshLeaderboard} />}
      >
        <View style={{ flex: 1, backgroundColor: "#8BC34A" }}>
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 24 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center", marginRight: 32 }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#ffffff" }}>Leaderboard</Text>
              <Text style={{ fontSize: 16, color: "#ffffff", marginTop: 4 }}>Green Score value</Text>
            </View>
          </View>

          {/* Top 3 Vendors */}
          {renderTopThreeVendors()}

          {/* Remaining Leaderboard */}
          <View
            style={{
              backgroundColor: "#F5F5F5",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 12,
              paddingBottom: 24,
              flex: 1,
              paddingHorizontal: 18,
            }}
          >
            {leaderboardData.map((vendor, idx) => (
              <View
                key={vendor.vendor_id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  marginBottom: 16,
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <View style={{ width: 32, alignItems: "center" }}>
                  <Text style={{
                    fontSize: 22,
                    fontWeight: "600",
                    color: "#161622",
                  }}>{idx + 1}</Text>
                </View>
                <Image
                  source={{ uri: vendor.imageUrl || "https://via.placeholder.com/150" }}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    marginHorizontal: 12,
                    backgroundColor: "#f3f4f6",
                    borderWidth: 2,
                    borderColor: "#e5e7eb",
                  }}
                  resizeMode="contain"
                />
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={{ fontSize: 18, fontWeight: "600", color: "#22223b" }}>{vendor.vendor_name}</Text>
                  <Text style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>
                    Green Score:{" "}
                    <Text style={{ color: "#22C55E", fontWeight: "bold" }}>
                      {vendor.vendor_green_score}%
                    </Text>
                  </Text>
                </View>
                <View style={{ width: 28, alignItems: "center" }}>
                  {getArrow(vendor.rank_change)}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Leaderboard;
