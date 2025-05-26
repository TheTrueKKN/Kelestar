import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";

const About = () => (
  <SafeAreaView style={{ flex: 1 }} className="bg-white">
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-[#006400] mb-2">
          About Kelestar
        </Text>
      </View>
      <Text className="text-base text-gray-700 mb-4">
        Kelestar is a sustainability-focused platform designed to help
        individuals and vendors track, manage, and reduce the carbon footprint
        of their meals. Our mission is to empower users to make greener food
        choices through data-driven insights and community engagement.
      </Text>
      <Text className="text-lg font-semibold text-[#22C55E] mb-2">
        Key Features
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        • Track your meal carbon footprint
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        • Vendor and customer dashboards
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        • Ingredient-level analysis
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        • Leaderboards and achievements
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        • AI-powered nutrition insights
      </Text>
      <Text className="text-lg font-semibold text-[#22C55E] mt-4 mb-2">
        Our Vision
      </Text>
      <Text className="text-base text-gray-700 mb-4">
        We believe that small, informed choices can lead to a more sustainable
        future. Kelestar aims to make sustainability accessible, actionable, and
        rewarding for everyone.
      </Text>
      <Text className="text-base text-gray-500 mt-8">
        Version 1.0.0 • © 2024 Kelestar
      </Text>
    </ScrollView>
  </SafeAreaView>
);

export default About;
