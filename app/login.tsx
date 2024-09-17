import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link } from "expo-router";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {};

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full h-full px-4 mb-6">
          <Text className="text-3xl font-urbanistbold text mb-4">
            Start tracking your meal footprint today
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="password"
            placeholder="Enter your password"
          />
          <View className="justify-end pt-4 flex-row gap-2 top-1">
            <Text className="text-gray-100 font-urbanistmedium">
              Forgot Password?
            </Text>
          </View>
          <CustomButton
            title="Log In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-4 flex-row gap-2 top-4">
            <Text className="font-urbanistmedium">Don't have an account?</Text>
            {/* <Text className="text-base text-secondary font-pregular">
              Register Now
            </Text> */}
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
