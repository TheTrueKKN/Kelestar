import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut, signOutIfSessionExists } from "../controllers/authController";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import { getUser } from "../controllers/userController";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() =>{
    const loadUserDate = async () => {
      const result = await getUser()
      if(result){
        setUserName(result.user_name as string)
        setEmail(result.user_email as string)
      }
    }
    loadUserDate();
  })

  const handleSignIn = async () => {
    setLoading(true);
    if (await signOutIfSessionExists()) {
      router.dismissAll();
      router.replace({ pathname: "/login" });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white">
          {/* Header with subtle shadow - matched with Calculator */}
          <View className="px-6 pt-12 pb-6 bg-white shadow-sm">
            <View className="flex-row items-center mb-3">
              <TouchableOpacity className="mr-3" onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#006400" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-[#006400]">
                Settings
              </Text>
            </View>
            <Text className="text-base text-[#74B318] mt-1">
              Manage your account preferences
            </Text>
          </View>

          {/* Settings List */}
          <View className="px-6 py-6">
            {/* Username */}
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <Text className="text-base text-[#333333]">Username</Text>
              <View className="flex-row items-center">
                <Text className="text-base text-gray-400 mr-1">{userName}</Text>
              </View>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <Text className="text-base text-[#333333]">Email</Text>
              <View className="flex-row items-center">
                <Text className="text-base text-gray-400 mr-1">{email}</Text>
              </View>
            </TouchableOpacity>

            {/* Feedback */}
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100" 
            onPress={() => router.push(
              "/feedback"
            )}>
              <Text className="text-base text-[#333333]">Feedback</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>

            {/* Terms and conditions */}
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <Text className="text-base text-[#333333]">Terms and conditions</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <Text className="text-base text-[#333333]">About</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          </View>
          
          {/*Logout Button */}
          <CustomButton
            title="Log Out"
            handlePress={handleSignIn}
            containerStyles="mt-7 mx-6"
            isLoading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;