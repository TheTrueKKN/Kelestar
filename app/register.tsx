import { View, Text, ScrollView, Image, AppState, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { signInWithEmail, signInWithOtp } from "../controllers/authController";
import { getUser, getUserByEmail, getUserByUsername } from "../controllers/userController";
import { UserRole } from "../enums/userRole";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    if (!username || !email) {
      Alert.alert("Please fill in both your username and email");
    }
    else if (await getUserByUsername(username)) {
      Alert.alert("Username has been taken,\nplease choose another username.");
    }
    else if (await getUserByEmail(email)) {
      Alert.alert("Email has been registered,\nplease login instead.");
    }
    else if (await signInWithOtp(username, email)) {
      // Alert.alert("Register successful");
      const userDetails = {
        username: username,
        email: email,
      };
      router.dismissAll();
      router.replace({ pathname: "/userverification", params: userDetails });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full h-full mb-6 flex-1 justify-center px-8 bg-white">
          <Text className="text-3xl font-urbanistbold text mb-4 mt-10">
            Welcome to join the sustainable community
          </Text>
          <FormField
            title="Username"
            value={username}
            handleChangeText={setUsername}
            otherStyles="mt-7"
            placeholder="Enter your username"
          />
          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          {/* <FormField
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
          </View> */}
       <CustomButton
        title="Register"
        handlePress={handleRegister}
        containerStyles="mt-7"
        isLoading={loading}
      />
          <View className="justify-center pt-4 flex-row gap-2 top-4">
            <Text className="font-urbanistmedium">
              Already have an account?
            </Text>
            <Text onPress={()=>{router.push("/login")}} className="font-urbanistmedium text-green">
              Log in
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
