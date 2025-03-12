import { View, Text, ScrollView, Image, AppState, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { signInWithEmail } from "../controller/authController";
import { getUser } from "../controller/userController";
import { UserRole } from "../enums/userRole";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    if (await signInWithEmail(email, password)) {
      // Alert.alert("Login successful");
      const user = await getUser();
      if (!user) {
        throw new Error("Failed to get user!");
      }

      if (!user.user_role) {
        router.push({ pathname: "/role_page" });
      } else if (user.user_role == UserRole.Vendor) {
        router.push({ pathname: "/vendordetail" });
      } else if (user.user_role == UserRole.Customer) {
        router.push({ pathname: "/faq" });
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full h-full mb-6 flex-1 justify-center px-8 bg-white">
          <Text className="text-3xl font-urbanistbold text mb-4">
            Start tracking your meal footprint today
          </Text>
          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
            otherStyles="mt-7"
            placeholder="Enter your password"
          />
          <View className="justify-end pt-4 flex-row gap-2 top-1">
            <Text className="text-gray-100 font-urbanistmedium">
              Forgot Password?
            </Text>
          </View>
          <CustomButton
            title="Log In"
            handlePress={handleSignIn}
            containerStyles="mt-7"
            isLoading={loading}
          />
          <View className="justify-center pt-4 flex-row gap-2 top-4">
            <Text className="font-urbanistmedium">Don't have an account?</Text>
            <Link href={"/register"} className="font-urbanistmedium text-green">
              Register Now
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
