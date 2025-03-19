import React from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Calculator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white">
          {/* Header with subtle shadow */}
          <View className="px-6 pt-12 pb-6 bg-white shadow-sm">
            <View className="flex-row items-center mb-3">
              <TouchableOpacity className="mr-3">
                <Ionicons name="chevron-back" size={24} color="#006400" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-[#006400]">
                Footprint Calculator
              </Text>
            </View>
            <Text className="text-base text-[#74B318] mt-1">
              Calculate your dish's environmental impact
            </Text>
          </View>

          {/* Form Content */}
          <View className="px-6 py-6">
            {/* Dish Name Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-[#006400] mb-2">DISH NAME</Text>
              <TextInput
                className="h-14 bg-[#F9F9F9] border border-[#DDDDDD] rounded-xl px-4 text-base"
                placeholder="Enter dish name"
                placeholderTextColor="#AAAAAA"
              />
            </View>

            {/* Ingredients Section */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-[#006400] mb-3">INGREDIENTS</Text>
              
              {/* Add ingredient button */}
              <TouchableOpacity 
                className="bg-[#74B318] h-12 rounded-xl flex-row items-center justify-center mb-4 w-48"
              >
                <View className="w-5 h-5 bg-white rounded-full items-center justify-center mr-2">
                  <Text className="text-[#74B318] font-bold">+</Text>
                </View>
                <Text className="text-white font-semibold">Add Ingredient</Text>
              </TouchableOpacity>
              
              {/* Ingredient tags - styled more elegantly */}
              <View className="flex-row flex-wrap">
                <View className="bg-[#F9F9F9] border border-[#DDDDDD] rounded-xl px-4 py-3 mr-2 mb-2 flex-row items-center">
                  <Text className="text-[#333333] mr-3">Potato 100g</Text>
                  <TouchableOpacity className="bg-white rounded-full w-6 h-6 items-center justify-center border border-[#DDDDDD]">
                    <Ionicons name="close" size={16} color="#777777" />
                  </TouchableOpacity>
                </View>

                <View className="bg-[#F9F9F9] border border-[#DDDDDD] rounded-xl px-4 py-3 mr-2 mb-2 flex-row items-center">
                  <Text className="text-[#333333] mr-3">Rice 150g</Text>
                  <TouchableOpacity className="bg-white rounded-full w-6 h-6 items-center justify-center border border-[#DDDDDD]">
                    <Ionicons name="close" size={16} color="#777777" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View className="flex-row flex-wrap">
                <View className="bg-[#F9F9F9] border border-[#DDDDDD] rounded-xl px-4 py-3 mr-2 mb-2 flex-row items-center">
                  <Text className="text-[#333333] mr-3">Lettuce 150g</Text>
                  <TouchableOpacity className="bg-white rounded-full w-6 h-6 items-center justify-center border border-[#DDDDDD]">
                    <Ionicons name="close" size={16} color="#777777" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Total Footprint Section */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#006400] mb-3">TOTAL FOOTPRINT</Text>
              
              {/* Footprint display - more elegant styling */}
              <View className="items-center bg-[#F9F9F9] border border-[#DDDDDD] rounded-xl px-6 py-8">
                {/* Green leaf icon with rating */}
                <View className="mb-4">
                  <View className="w-24 h-24 bg-[#74B318] rounded-full items-center justify-center shadow-sm">
                    <Text className="text-white text-5xl font-bold">A</Text>
                  </View>
                </View>

                {/* Rating scale - more elegant and consistent */}
                <View className="flex-row items-center mb-4 w-64 h-5 overflow-hidden rounded-full">
                  <View className="h-full flex-1 bg-[#74B318]" />
                  <View className="h-full flex-1 bg-[#A4D056]" />
                  <View className="h-full flex-1 bg-[#FFDA44]" />
                  <View className="h-full flex-1 bg-[#F87171]" />
                </View>

                {/* CO2 value */}
                <Text className="text-[#333333] font-semibold text-xl mb-3">1.4kg CO2e</Text>

                {/* What does this label mean */}
                <TouchableOpacity className="mt-2">
                  <Text className="text-[#74B318] font-medium">What does this label mean?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Calculator;