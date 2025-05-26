import React, { useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { icons } from '../../constants';

// Dish data type definition
type Dish = {
  id: string;
  name: string;
  image: any;
  store: string;
  price: string;
};

// Dish card component - reused from home.tsx
const DishCard = ({ dish, onPress }: { dish: Dish, onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className="mx-[19px] mt-[15px] w-auto h-[128px] p-3 bg-[#F2F2F2] rounded-md flex-row">
    <Image 
      source={dish.image}
      className="w-[100px] h-[100px] rounded-l-md"
      resizeMode="cover"
    />
    
    <View className="flex-1 p-4 justify-center">
      <Text className="font-psemibold text-[18px] text-[#1E1F1F]">{dish.name}</Text>
      <Text className="font-pregular text-[14px] text-gray-500 mt-1">{dish.store}</Text>
      <Text className="font-pbold text-[16px] text-green mt-2">{dish.price}</Text>
    </View>
  </TouchableOpacity>
);

export default function ChooseMeal() {
  const [selectedStore, setSelectedStore] = useState('Asian');
  const router = useRouter();

  // Store categories data
  const storeCategories = ['Asian', 'Western', 'Indian', 'Italian', 'Japanese', 'Malay', 'Chinese'];
  
  // Asian store dishes data
  const asianDishes: Dish[] = [
    {
      id: '1',
      name: 'Salmon Poke Bowl',
      image: require("../../assets/images/tofu_bowl_pic.png"), // Placeholder - replace with actual images
      store: 'Poke2U',
      price: 'RM 15.90'
    },
    {
      id: '2',
      name: 'Tuna Poke Bowl',
      image: require("../../assets/images/mixed_rice_pic.png"), // Placeholder
      store: 'Poke2U',
      price: 'RM 14.50'
    },
    {
      id: '3',
      name: 'Veggie Poke Bowl',
      image: require("../../assets/images/egg_salad_pic.png"), // Placeholder
      store: 'Poke2U',
      price: 'RM 12.90'
    }
  ];

  const handleDishPress = (dish: Dish) => {
    router.push({
      pathname: "/tracking",
      params: {
        name: dish.name,
        // Convert the required image to a string ID that can be used to identify which image to display
        imageId: dish.id,
        store: dish.store,
        price: dish.price,
      },
    });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="relative flex-1">
          {/* Title with added top margin for better spacing from notification bar */}
          <View className="flex-row justify-between items-start px-[19px] mt-[20px]">
            <Text className="w-full h-[42px] font-psemibold text-[28px] leading-[42px] text-[#1E1F1F]">
              Choose Meal to Track
            </Text>
          </View>
          
          {/* Search bar */}
          <View className="flex-row items-center text-base mx-[19px] bg-[#F5F5F5] rounded-xl px-4 py-1">
            <TextInput
              placeholder="Search your favorite meal"
              placeholderTextColor="#8B8B8B"
              className="flex-1 font-pregular text-base mt-2 h-10 text-left"
            />
            <TouchableOpacity>
              <Image
                source={icons.search}
                className="w-5 h-5"
                resizeMode="contain"
                tintColor="#8B8B8B"
              />
            </TouchableOpacity>
          </View>

          {/* Store categories column */}
          <View className="mt-6 pl-[19px]">
            {/* Horizontal scrollable area for store categories */}
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {/* Store category items */}
              {storeCategories.map((store, index) => (
                <TouchableOpacity 
                  key={index} 
                  className="mr-3 items-center w-[85px]"
                  onPress={() => setSelectedStore(store)}
                >
                  <View 
                    className={`rounded-xl w-[80px] h-[80px] items-center justify-center ${
                      selectedStore === store ? 'bg-[#F5F5F5] border-2 border-green' : 'bg-[#F5F5F5]'
                    }`}
                  >
                    {/* Store icon placeholder */}
                    <View className="w-9 h-9 bg-[#E0E0E0] rounded-full items-center justify-center">
                      <Text className="font-psemibold text-[12px]">{store.charAt(0)}</Text>
                    </View>
                  </View>
                  <Text className="text-[12px] font-psemibold mt-2 text-center">{store}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Store logo and description section */}
          {selectedStore === 'Asian' && (
            <View className="mt-6 items-center">
              {/* Store logo */}
              <View className="w-full items-center h-[167px] justify-center">
                <Image 
                  source={require('../../assets/images/poke2u_logo.png')}
                  className="w-[150px] h-[150px]"
                  resizeMode="contain"
                />
              </View>
              
              {/* Store description */}
              <View className="px-[19px] mt-2 mb-4">
                <Text className="text-center font-pregular text-[14px] text-[#555]">
                  We've got the poke bowl you're looking for. Full of freshness, deliciousness and a whole lot more.
                </Text>
              </View>

              {/* Section title */}
              <View className="self-start ml-[19px] mt-2 mb-2">
                <Text className="font-psemibold text-[20px] text-[#1E1F1F]">Menu</Text>
              </View>

              {/* Dishes from this store */}
              {asianDishes.map(dish => (
                <DishCard key={dish.id} dish={dish} onPress={() => handleDishPress(dish)} />
              ))}
            </View>
          )}

          {/* Placeholder for other stores */}
          {selectedStore !== 'Asian' && (
            <View className="mt-6 items-center px-[19px]">
              <Text className="text-center font-pregular text-[16px] text-[#555]">
                {selectedStore} restaurant information will be displayed here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
