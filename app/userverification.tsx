import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { Link, useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";
import { supabase } from "../lib/supabase";
import { updateUser } from "../controller/userController";
import { signInWithEmail, signUpWithEmail } from "../controller/authController";

export default function UserVerification() {
  const router = useRouter();
  const handlePress = () => {
    router.push({ pathname: "/login" });
  };

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <Text className="text-3xl font-urbanistbold text mb-4">
        Press <Link href={"/login"} className="text-green">Login</Link> after you have completed email verification
      </Text>
      <CustomButton
        title="Login"
        handlePress={handlePress}
        containerStyles="mt-7"
      />
    </View>
  );
}
