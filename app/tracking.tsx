import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { router, useLocalSearchParams } from "expo-router";
import Tooltip from 'react-native-walkthrough-tooltip';
import { icons } from "../constants";
import DateTimePicker from '@react-native-community/datetimepicker';

const Tracking = () => {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("Carbon Info");
  const { name, imageId, store, price } = useLocalSearchParams();
  const [date, setDate] = useState(new Date("2025-04-10T22:50:53Z")); // Using current date/time
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGradeTooltip, setShowGradeTooltip] = useState(false);

  const getImage = (id: string) => {
    switch(id) {
      case '1':
        return require("../assets/images/tofu_bowl_pic.png");
      case '2':
        return require("../assets/images/mixed_rice_pic.png");
      case '3':
        return require("../assets/images/egg_salad_pic.png");
      default:
        return require("../assets/images/tofu_bowl_pic.png");
    }
  };

  // Chart data for carbon footprint breakdown
  const pieData = [
    {
      name: "Tofu",
      population: 48.1,
      color: "#FF5C5C",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Veggie",
      population: 45.6,
      color: "#00D1A0",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Rice",
      population: 6.3,
      color: "#FFBF47",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <TouchableOpacity 
          className="w-10 h-10 bg-[#F2F2F2] rounded-full items-center justify-center"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Image 
            source={icons.leftArrow}
            className="w-5 h-5"
            resizeMode="contain"
            accessibilityLabel="Back arrow"
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="pb-[120px]"
      >
        <View>
          {/* Header Section */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-gray-800">
              Let&apos;s take a deep look at
            </Text>
            <Text className="text-2xl font-bold text-green mt-1">{name}</Text>
            <Text className="text-base text-gray-500 mt-1">From {store}</Text>
          </View>

          {/* Dish Image */}
          <View className="px-4">
            <View className="w-full h-[200px] rounded-2xl bg-gray-50 shadow-md overflow-hidden">
              <Image
                source={getImage(imageId as string)}
                className="w-full h-full"
                resizeMode="contain"
                accessibilityLabel={`Image of ${name}`}
              />
            </View>
          </View>

          {/* Price and Grade Section */}
          <View className="flex-row justify-between items-center px-4 mt-6">
            <View>
              <Text className="text-sm text-gray-500">Price</Text>
              <Text className="text-xl font-bold text-black mt-1">{price}</Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-green w-10 h-10 rounded-full items-center justify-center shadow-sm">
                <Text className="text-white font-bold text-lg">A</Text>
              </View>
              <Tooltip
                isVisible={showGradeTooltip}
                content={
                  <View className="w-[200px]">
                    <Text className="text-black">
                      Grade 'A' indicates this meal has a low carbon footprint and is environmentally sustainable. 
                      It's among the top-rated choices for eco-conscious dining.
                    </Text>
                  </View>
                }
                placement="top"
                onClose={() => setShowGradeTooltip(false)}
                backgroundColor="rgba(0, 0, 0, 0.8)"
                showChildInTooltip={false}
                tooltipStyle={{
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity 
                  className="ml-2"
                  onPress={() => setShowGradeTooltip(true)}
                >
                  <Text className="text-sm text-gray-500 underline">
                    What does this mean?
                  </Text>
                </TouchableOpacity>
              </Tooltip>
            </View>
          </View>

          {/* Tab Navigation */}
          <View className="flex-row justify-around mt-8 border-b border-gray-200">
            {['Carbon Info', 'Nutrition', 'Ingredients'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                accessibilityLabel={`Switch to ${tab} tab`}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab }}
                className={`pb-2 ${
                  activeTab === tab
                    ? 'border-b-2 border-green'
                    : 'border-b-2 border-transparent'
                }`}
              >
                <Text
                  className={`text-base font-semibold ${
                    activeTab === tab ? 'text-green' : 'text-gray-500'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View className="px-4 mt-4">
            {/* Carbon Info Tab */}
            {activeTab === 'Carbon Info' && (
              <View>
                <Text className="text-lg font-semibold text-center mb-4">
                  Total CO₂e: 1.4KG
                </Text>
                <View className="items-center">
                  <PieChart
                    data={pieData}
                    width={width - 40}
                    height={200}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                </View>
              </View>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'Nutrition' && (
              <View>
                <Text className="text-lg font-semibold text-gray-800 mb-4">
                  Nutrition Facts
                </Text>
                <View className="space-y-2">
                  <Text className="text-base text-gray-700">Calories: 450 kcal</Text>
                  <Text className="text-base text-gray-700">Protein: 25g</Text>
                  <Text className="text-base text-gray-700">Carbohydrates: 50g</Text>
                  <Text className="text-base text-gray-700">Fats: 15g</Text>
                  <Text className="text-base text-gray-700">Fiber: 8g</Text>
                  <Text className="text-base text-gray-700">Sodium: 300mg</Text>
                  <Text className="text-base text-gray-700">Servings: 2</Text>
                  <Text className="text-base text-gray-700">Sugars: 5g</Text>
                  <Text className="text-base text-gray-700">Cholesterol: 20mg</Text>
                </View>
              </View>
            )}

            {/* Ingredients Tab */}
            {activeTab === 'Ingredients' && (
              <View>
                <Text className="text-lg font-semibold text-gray-800 mb-4">
                  Ingredients
                </Text>
                <View className="space-y-2">
                  <Text className="text-base text-gray-700">- Tofu <Text className="text-sm text-gray-500">(0.5kg CO₂e)</Text></Text>
                  <Text className="text-base text-gray-700">- Brown Rice <Text className="text-sm text-gray-500">(0.3kg CO₂e)</Text></Text>
                  <Text className="text-base text-gray-700">- Mixed Vegetables <Text className="text-sm text-gray-500">(0.2kg CO₂e)</Text></Text>
                  <Text className="text-base text-gray-700">- Soy Sauce <Text className="text-sm text-gray-500">(0.1kg CO₂e)</Text></Text>
                  <Text className="text-base text-gray-700">- Sesame Seeds <Text className="text-sm text-gray-500">(0.05kg CO₂e)</Text></Text>
                  <Text className="text-base text-gray-700">- Olive Oil <Text className="text-sm text-gray-500">(0.1kg CO₂e)</Text></Text>
                </View>
                <Text className="text-lg font-bold text-gray-800 mt-4">
                  Total Estimated Carbon Emission: 1.25kg CO₂e
                </Text>
              </View>
            )}
          </View>

          {/* Date Picker Section */}
          <View className="px-4 mt-8">
            <Text className="text-base font-semibold text-gray-700 mb-2">
              Track for Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 flex-row items-center justify-between"
            >
              <Text className="font-medium text-gray-800">
                {date.toLocaleDateString('en-GB')}
              </Text>
              <Image 
                source={icons.play}
                className="w-4 h-4 -rotate-90"
                resizeMode="contain"
              />
            </TouchableOpacity>

            {Platform.OS === 'android' ? (
              showDatePicker && (
                <DateTimePicker
                  testID="datePicker"
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate && event.type !== 'dismissed') {
                      setDate(selectedDate);
                    }
                  }}
                />
              )
            ) : (
              <View className={showDatePicker ? 'h-[216px]' : 'h-0'}>
                <DateTimePicker
                  testID="datePicker"
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                />
              </View>
            )}
          </View>

          {/* Start Tracking Button */}
          <View className="px-4 mt-8 mb-4">
            <TouchableOpacity 
              className="bg-green py-4 rounded-xl shadow-sm active:opacity-90"
              onPress={() => {
                // Add tracking logic here
              }}
              accessibilityLabel="Start tracking this meal"
              accessibilityRole="button"
            >
              <Text className="text-white text-center font-bold text-lg">
                Start Tracking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tracking;