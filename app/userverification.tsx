import {
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";
import { getUser } from "../controllers/userController";
import { verifyEmailOtp } from "../controllers/authController";
import FormField from "../components/FormField";
import { UserRole } from "../enums/userRole";

export default function UserVerification() {
  const [token, setToken] = useState("");

  const router = useRouter();
  const { username, email } = useLocalSearchParams() as {
    username: string;
    email: string;
  };;
  const handlePress = async () => {
    if (await verifyEmailOtp(email, token))
    {
      // Alert.alert("Login successful");
      const user = await getUser();
      if (!user) {
        throw new Error("Failed to get user!");
      }
      router.dismissAll();
      if (!user.user_role) {
        router.replace({ pathname: "/role_page" });
      } else if (user.user_role == UserRole.Vendor) {
        router.replace({ pathname: "/vendordetail" });
      } else if (user.user_role == UserRole.Customer) {
        router.replace({ pathname: "/faq" });
      }
      // router.push({ pathname: "/login" });
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      {/* <Text className="text-3xl font-urbanistbold text mb-4">
        Press <Link href={"/login"} className="text-green">Login</Link> after you have completed email verification
      </Text>
      <CustomButton
        title="Login"
        handlePress={handlePress}
        containerStyles="mt-7"
      /> */}
      <Text className="text-3xl font-urbanistbold text mb-4">
        Enter the OTP sent in the verification email
      </Text>
      <FormField
        title=""
        value={token}
        handleChangeText={setToken}
        otherStyles="mt-7"
        keyboardType="numeric"
      />
      <CustomButton
        title="Login"
        handlePress={handlePress}
        containerStyles="mt-7"
      />
    </View>
  );
}
