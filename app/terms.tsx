import React from "react";
import { Text, ScrollView, SafeAreaView } from "react-native";

const Terms = () => (
  <SafeAreaView style={{ flex: 1 }} className="bg-white">
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text className="text-3xl font-bold text-[#006400] mb-4">
        Terms & Conditions
      </Text>
      <Text className="text-base text-gray-700 mb-4">
        Welcome to Kelestar! By using our app, you agree to the following terms
        and conditions. Please read them carefully.
      </Text>
      <Text className="text-lg font-semibold text-[#22C55E] mb-2">
        1. Use of Service
      </Text>
      <Text className="text-base text-gray-700 mb-4">
        Kelestar is designed to help users track, manage, and reduce their meal
        carbon footprint. You agree to use the app for lawful purposes and not
        to misuse the service.
      </Text>
      <Text className="text-lg font-semibold text-[#22C55E] mb-2">
        2. User Accounts
      </Text>
      <Text className="text-base text-gray-700 mb-4">
        You are responsible for maintaining the confidentiality of your account
        information. Please ensure your details are accurate and up to date.
      </Text>
      <Text className="text-lg font-semibold text-[#22C55E] mb-2">
        3. Data & Privacy
      </Text>
      <Text className="text-base text-gray-700 mb-4">
        We respect your privacy. Your data is used solely to provide and improve
        the Kelestar experience. We do not sell your personal information to
        third parties.
      </Text>
      <Text className="text-lg font-semibold text-[#22C55E] mb-2">
        4. Content
      </Text>
      <Text className="text-base text-gray-700 mb-4">
        All content, including images and data, is for informational purposes
        only. Kelestar is not responsible for inaccuracies or user-generated
        content.
      </Text>
      <Text className="text-lg font-semibold text-[#22C55E] mb-2">
        5. Changes to Terms
      </Text>
      <Text className="text-base text-gray-700 mb-4">
        We may update these terms from time to time. Continued use of Kelestar
        means you accept any changes.
      </Text>
      <Text className="text-base text-gray-500 mt-8">
        If you have questions, contact us via the Feedback section in the app.
      </Text>
    </ScrollView>
  </SafeAreaView>
);

export default Terms;
