import { View, Text, ScrollView, AppState, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { signInWithOtp } from "../controllers/authController";
import { getUserByEmail} from "../controllers/userController";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    if (!email) {
      Alert.alert("Email cannot be blank");
    } else if (!await getUserByEmail(email)) {
      Alert.alert("Email is not registered yet, please register instead.");
    } else if (await signInWithOtp(username, email)) {
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
          <Text className="text-3xl font-urbanistbold text mb-4">
            Start tracking your meal footprint today
          </Text>
          {/* <FormField
            title="Username"
            value={username}
            handleChangeText={setUsername}
            otherStyles="mt-7"
            placeholder="Enter your username"
          /> */}
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
            title="Log In"
            handlePress={handleSignIn}
            containerStyles="mt-7"
            isLoading={loading}
          />
          <View className="justify-center pt-4 flex-row gap-2 top-4">
            <Text className="font-urbanistmedium">Don't have an account?</Text>
            <Text onPress={()=>{router.push("/register")}} className="font-urbanistmedium text-green">
              Register Now
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
