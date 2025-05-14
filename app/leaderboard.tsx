import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  ScrollView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define TypeScript interfaces
interface Restaurant {
  id: string;
  rank: number;
  name: string;
  score: number;
  isTopThree?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

const Leaderboard = () => {
  // Mock data for restaurants
  const restaurantData: Restaurant[] = [
    { id: '1', rank: 1, name: 'Green bowl', score: 10, isTopThree: true },
    { id: '2', rank: 2, name: 'SpicySpice', score: 8, isTopThree: true },
    { id: '3', rank: 3, name: 'Tea Time', score: 7, isTopThree: true },
    { id: '4', rank: 4, name: 'Seafood Homie', score: 5, trend: 'up' },
    { id: '5', rank: 5, name: 'Wok Wok', score: 4, trend: 'down' },
    { id: '6', rank: 6, name: 'Protein Boost', score: 2, trend: 'up' },
    { id: '7', rank: 7, name: 'Veggie Delight', score: 1, trend: 'neutral' },
    { id: '8', rank: 8, name: 'Pasta Palace', score: 1, trend: 'down' },
    { id: '9', rank: 9, name: 'Burger Joint', score: 1, trend: 'up' },
    { id: '10', rank: 10, name: 'Sushi Express', score: 0, trend: 'neutral' },
  ];

  const renderTopThree = () => {
    const topThree = restaurantData.filter((item) => item.isTopThree);
    
    return (
      <View className="flex-row justify-around px-2 mt-6 mb-8">
        {topThree.map((restaurant) => (
          <View 
            key={restaurant.id} 
            className={`items-center w-[30%] ${restaurant.rank === 1 ? "scale-110" : ""}`}
          >
            <View className="absolute top-[-5] left-1 w-8 h-8 bg-[#FFEB3B] rounded-full items-center justify-center z-10">
              <Text className="font-bold text-base">{restaurant.rank}</Text>
            </View>
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-2">
              {/* Logo placeholder */}
            </View>
            <Text className="font-bold text-white text-center">{restaurant.name}</Text>
            <Text className="font-bold text-lg text-white">{restaurant.score}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderListItem = (restaurant: Restaurant) => {
    return (
      <View key={restaurant.id} className="flex-row items-center bg-white mx-5 my-2 rounded-xl p-4 shadow-sm">
        <Text className="font-bold text-lg w-8">{restaurant.rank}</Text>
        <View className="w-10 h-10 bg-[#f0f0f0] rounded-full mr-4">
          {/* Logo placeholder */}
        </View>
        <Text className="flex-1 font-bold text-base">{restaurant.name}</Text>
        <View className="flex-row items-center ml-2">
          <Text className="font-bold text-lg mr-1">{restaurant.score}</Text>
          {restaurant.trend === 'up' && <Ionicons name="arrow-up" size={16} color="#4CAF50" />}
          {restaurant.trend === 'down' && <Ionicons name="arrow-down" size={16} color="#F44336" />}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#8BC34A]">
      <StatusBar barStyle="light-content" backgroundColor="#8BC34A" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-[#8BC34A]">
          {/* Header with back button */}
          <View className="flex-row items-center px-5 pt-6">
            <TouchableOpacity className="mr-3">
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View className="flex-1 items-center mr-10">
              <Text className="text-2xl font-bold text-white">Leaderboard</Text>
              <Text className="text-base text-white mt-1">No of Green Meals</Text>
            </View>
          </View>
          
          {/* Top 3 restaurants */}
          {renderTopThree()}
          
          {/* List of other restaurants */}
          <View className="bg-[#F5F5F5] rounded-t-3xl pt-3 pb-6 flex-1">
            {restaurantData
              .filter((restaurant) => restaurant.rank > 3)
              .map(renderListItem)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Leaderboard;