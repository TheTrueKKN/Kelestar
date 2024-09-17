import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

// Correct way to import an image in Expo
const kelestarLogo = require('../assets/images/kelestarlogo.png');

export default function App() {
  return (
    <View className="flex-1 bg-[#B4D66F]">
      <StatusBar style="auto" />
      {/* Main content area */}
      <View className="flex-1 items-center justify-center pb-12">
        {/* Centering text and logo */}
        <View className="items-center mb-5">
          {/* Increased the font size of "Kelestar" and added margin */}
          <Text className="text-4xl font-bold text-[#4A6D1D] mb-4">Kelestar</Text>
          <Image 
            source={kelestarLogo}
            className="w-32 h-32"
          />
        </View>
        <Text className="text-base text-[#4A6D1D] text-center mb-5">
          A footprint disclosure platform{'\n'}
          in Monash University canteen
        </Text>
        <Link href="/register" asChild>
          <TouchableOpacity className="bg-[#7AB92F] py-4 px-8 rounded-full">
            <Text className="text-white text-lg font-bold">Login/Register</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
