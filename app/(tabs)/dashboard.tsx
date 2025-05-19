import React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Link } from "expo-router";

const pieData = [
  {
    name: "Beef",
    population: 30,
    color: "#3B82F6", // blue
    legendFontColor: "#54595E",
    legendFontSize: 15,
  },
  {
    name: "Poultry",
    population: 20,
    color: "#22C55E", // green
    legendFontColor: "#54595E",
    legendFontSize: 15,
  },
  {
    name: "Mutton",
    population: 35,
    color: "#FACC15", // yellow
    legendFontColor: "#54595E",
    legendFontSize: 15,
  },
  {
    name: "Others",
    population: 15,
    color: "#38BDF8", // light blue
    legendFontColor: "#54595E",
    legendFontSize: 15,
  },
];

const chartColors = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#FACC15", // yellow
  "#38BDF8", // light blue
  "#0EA5E9", // sky blue
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
      <View className="px-5 pt-6 pb-8">
        <Text className="text-3xl font-pbold text-primary mb-2">
          Carbon Dashboard
        </Text>
        <View className="flex-row justify-between mt-4">
          <View className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 mr-1 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="text-xs text-secondary font-psemibold mb-1">
              My Income
            </Text>
            <Text className="text-xl font-bold text-primary">RM12,750</Text>
          </View>
          <View className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 ml-1 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="text-xs text-green font-psemibold mb-1">
              Total Footprint
            </Text>
            <Text className="text-xl font-bold text-primary">1673 Kg</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 mr-1 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="text-xs text-yellow-500 font-psemibold mb-1">
              Ranking
            </Text>
            <Text className="text-xl font-bold text-primary">#1</Text>
          </View>
          <View className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 ml-1 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="text-xs text-green font-psemibold mb-1">
              Green Meals
            </Text>
            <Text className="text-xl font-bold text-primary">10</Text>
          </View>
        </View>

        {/* Pie Chart */}
        <Text className="mt-7 text-lg font-semibold text-primary mb-2 text-left">
          Footprint Composition by Ingredients
        </Text>
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-4">
          <PieChart
            data={pieData}
            width={width - 60}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `#54595E`,
              labelColor: (opacity = 1) => `#54595E`,
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              style: { borderRadius: 18 },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <Text className="text-lg font-semibold text-primary mb-2 text-left">
          Dish Footprint
        </Text>
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <BarChart
            data={{
              labels: barData.labels.map(() => ""), // Hide x-axis labels
              datasets: [
                {
                  data: barData.datasets[0].data,
                  colors: chartColors.map((color) => () => color),
                },
              ],
            }}
            width={width - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            showValuesOnTopOfBars
            withCustomBarColorFromData={true}
            flatColor={true}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (_index, opacity = 1) => {
                const index = typeof _index === "number" ? _index : 0;
                return chartColors[index % chartColors.length];
              },
              labelColor: (opacity = 1) => `#54595E`,
              propsForLabels: { fontSize: 13, fontWeight: "bold", dy: 8 },
              propsForBackgroundLines: {
                stroke: "#E5E7EB",
                strokeDasharray: "4",
              },
              style: { borderRadius: 18 },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 18,
              paddingRight: 10,
            }}
          />
        </View>
        {/* Chart legend for bars */}
        <View className="flex-row flex-wrap justify-center mt-3">
          {barData.labels.map((label, idx) => (
            <View key={label} className="flex-row items-center mx-2 mb-2">
              <View
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: chartColors[idx % chartColors.length],
                }}
              />
              <Text className="text-xs text-gray-500 ml-1">{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
