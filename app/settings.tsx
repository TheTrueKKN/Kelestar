import { View, Text } from "react-native";
import React, { useState } from "react";
import { signOut, signOutIfSessionExists } from "../controllers/authController";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";

const settings = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    if (await signOutIfSessionExists()) {
      router.dismissAll();
      router.replace({ pathname: "/login" });
    }
    setLoading(false);
  };

  return (
    <View>
      <CustomButton
        title="Log Out"
        handlePress={handleSignIn}
        containerStyles="mt-7"
        isLoading={loading}
      />
    </View>
  );
};

export default settings;
