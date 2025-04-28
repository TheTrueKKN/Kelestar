import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

// Correct way to import an image in Expo
const kelestarLogo = require("../assets/images/kelestarlogo.png");

export default function LandingPage() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />

      {/* Linear Gradient Background */}
      <LinearGradient
        colors={["rgba(0, 128, 0, 0.2)", "rgba(0, 128, 0, 0.9)"]} // Start with a more opaque green and end with a lighter transparent green
        start={{ x: 0, y: 0 }} // Starting point of the gradient (top-left)
        end={{ x: 0, y: 1 }} // Ending point of the gradient (bottom-left)
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }} // Ensures the gradient covers the entire screen
      >
        {/* Main content area */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 24,
          }}
        >
          {/* Centering text and logo */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            {/* Increased the font size of "Kelestar" and added more margin below */}
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                color: "#023020",
                marginBottom: 32,
              }}
            >
              Kelestar
            </Text>
            <Image
              source={kelestarLogo}
              style={{ width: 128, height: 128 }} // Adjust size for the logo
            />
          </View>

          <Text
            style={{
              fontSize: 16,
              color: "#023020",
              textAlign: "center",
              marginBottom: 20,
              fontWeight: "bold",
            }}
          >
            A Footprint Disclosure Platform{"\n"}
            in Monash University Canteen
          </Text>

          <Link href="/login" asChild>
            <TouchableOpacity
              style={{
                backgroundColor: "#5B3A29",
                paddingVertical: 16,
                paddingHorizontal: 56,
                borderRadius: 50,
                marginTop: 40,
              }}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}
              >
                Login/Register
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </LinearGradient>
    </View>
  );
}
