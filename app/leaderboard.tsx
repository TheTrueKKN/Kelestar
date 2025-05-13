import { useRouter } from "expo-router";
import { icons } from "../constants";
import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';


// Hardcoded leaderboard data
const leaderboardData = [
  {
    id: 1,
    name: "Poke2U",
    logo: require("../assets/images/poke2u_logo.png"),
    greenMeals: 32,
    change: "up",
  },
  {
    id: 2,
    name: "Vendor A",
    logo: require("../assets/images/vendor_logo.png"),
    greenMeals: 28,
    change: "down",
  },
  {
    id: 3,
    name: "Vendor B",
    logo: require("../assets/images/chicken_rice.png"),
    greenMeals: 25,
    change: "neutral",
  },
  {
    id: 4,
    name: "Vendor C",
    logo: require("../assets/images/beef_shawarma_set.png"),
    greenMeals: 21,
    change: "up",
  },
  {
    id: 5,
    name: "Vendor D",
    logo: require("../assets/images/egg_salad_pic.png"),
    greenMeals: 18,
    change: "down",
  },
];

function getArrow(change: string) {
  if (change === "up") {
    return (
      <MaterialIcons name="keyboard-arrow-up" size={24} color="#22C55E" style={{ marginTop: 2 }} />
    );
  } else if (change === "down") {
    return (
      <MaterialIcons name="keyboard-arrow-down" size={24} color="#EF4444" style={{ marginTop: 2 }} />
    );
  } else {
    return null;
  }
}



const Leaderboard = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Back Button and Header */}
        <View style={{ paddingTop: 48, paddingBottom: 8, paddingHorizontal: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <View style={{ marginRight: 8 }}>
              <MaterialIcons
                name="arrow-back-ios"
                size={28}
                color="#161622"
                style={{ padding: 4 }}
                onPress={() => router.back()}
                accessibilityLabel="Go back"
              />
            </View>
            <Text style={{ fontSize: 32, fontFamily: "Poppins-Bold", color: "#161622", flex: 1 }}>Leaderboard</Text>
          </View>
          <Text style={{ fontSize: 16, fontFamily: "Poppins-Regular", color: "#74B318", textAlign: "left" }}>Top Vendors by Green Scores</Text>
        </View>

        {/* Leaderboard List */}
        <View style={{ paddingHorizontal: 18 }}>
          {leaderboardData.map((vendor, idx) => (
            <View
              key={vendor.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: idx < 3 ? "#F8F9FA" : "#fff",
                borderRadius: 18,
                marginBottom: 16,
                paddingVertical: 16,
                paddingHorizontal: 16,
                shadowColor: idx < 3 ? "#74B318" : "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: idx < 3 ? 0.12 : 0.06,
                shadowRadius: 8,
                elevation: idx < 3 ? 6 : 2,
                borderWidth: idx < 3 ? 1.5 : 1,
                borderColor: idx === 0 ? "#74B318" : "#E5E7EB",
              }}
            >
              {/* Rank */}
              <View style={{ width: 32, alignItems: "center" }}>
                <Text style={{
                  fontSize: 22,
                  fontFamily: idx === 0 ? "Poppins-Bold" : "Poppins-SemiBold",
                  color: idx === 0 ? "#74B318" : "#161622",
                }}>{idx + 1}</Text>
              </View>
              {/* Logo */}
              <Image
                source={vendor.logo}
                style={{ width: 54, height: 54, borderRadius: 16, marginHorizontal: 12, backgroundColor: "#f3f4f6", borderWidth: 2, borderColor: "#e5e7eb" }}
                resizeMode="contain"
              />
              {/* Name and Meals */}
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={{ fontSize: 18, fontFamily: "Poppins-SemiBold", color: "#22223b" }}>{vendor.name}</Text>
                <Text style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>Green Meals: <Text style={{ color: "#22C55E", fontWeight: "bold" }}>{vendor.greenMeals}</Text></Text>
              </View>
              {/* Arrow */}
              <View style={{ width: 28, alignItems: "center" }}>{getArrow(vendor.change)}</View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Leaderboard;