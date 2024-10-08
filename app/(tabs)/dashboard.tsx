import React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Link } from "expo-router";

const pieData = [
  {
    name: "Beef",
    population: 30,
    color: "#FF5C5C",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Poultry",
    population: 20,
    color: "#00D1A0",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Mutton",
    population: 35,
    color: "#FFBF47",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Others",
    population: 15,
    color: "#4CAF50",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];

const barData = {
  labels: [
    "Chicken Rice",
    "Mutton Curry",
    "Tofu Bowl",
    "Beef Salad",
    "Fried Shrimp",
  ],
  datasets: [
    {
      data: [80, 110, 50, 123, 85],
    },
  ],
};

const Dashboard = () => {
  const { width } = useWindowDimensions();

  return (
    <ScrollView className="bg-white h-full">
      <View className="p-6">
        <Text className="text-2xl font-bold text-black">Carbon Dashboard</Text>
        <View className="flex-row justify-between mt-4">
          <View className="bg-gray-100 p-4 rounded-lg w-1/2 mr-2">
            <Text className="text-xs text-blue-500">My Income</Text>
            <Text className="text-lg font-semibold">RM12,750</Text>
          </View>
          <View className="bg-gray-100 p-4 rounded-lg w-1/2 ml-2">
            <Text className="text-xs text-green">Total Footprint</Text>
            <Text className="text-lg font-semibold">1673 Kg</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="bg-gray-100 p-4 rounded-lg w-1/2 mr-2">
            <Text className="text-xs text-yellow-500">Ranking</Text>
            <Text className="text-lg font-semibold">#1</Text>
          </View>
          <View className="bg-gray-100 p-4 rounded-lg w-1/2 ml-2">
            <Text className="text-xs text-green">Green Meals</Text>
            <Text className="text-lg font-semibold">10</Text>
          </View>
        </View>

        {/* Pie Chart */}
        <Text className="mt-6 text-lg font-semibold text-center">
          Footprint Composition by Ingredients
        </Text>
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

        {/* Bar Chart */}
        <Text className="mt-6 text-lg font-semibold text-center">
          Dish Footprint
        </Text>
        <BarChart
          data={barData}
          width={width - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />

        {/* Bottom Navigation (Test) */}
        <View className="flex-row justify-around bg-gray-100 py-4 mt-6 rounded-lg">
          <Link href="/" className="text-center">
            <Text className="text-green">🏠</Text>
          </Link>
          <Link href="/" className="text-center">
            <Text className="text-gray-500">🍽</Text>
          </Link>
          <Link href="/" className="text-center">
            <Text className="text-gray-500">👤</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
