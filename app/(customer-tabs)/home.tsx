import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

// Dish data type definition
type Dish = {
  id: string;
  name: string;
  image: any;
  store: string;
  price: string;
};

// Dish card component to avoid repeated code
const DishCard = ({ dish, onPress }: { dish: Dish, onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className="mx-[19px] mt-[15px] w-auto h-[128px] p-3 bg-[#F2F2F2] rounded-2xl flex-row">
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

export default function CustomerHome() {
  const router = useRouter();

  // Dish data array
  const dishes: Dish[] = [
    {
      id: '1',
      name: 'Tofu Bowl',
      image: require("../../assets/images/tofu_bowl_pic.png"),
      store: 'Healthy Eats',
      price: 'RM 12.90'
    },
    {
      id: '2',
      name: 'Mixed Rice',
      image: require("../../assets/images/mixed_rice_pic.png"),
      store: 'Asian Delights',
      price: 'RM 10.50'
    },
    {
      id: '3',
      name: 'Egg Salad',
      image: require("../../assets/images/egg_salad_pic.png"),
      store: 'Fresh & Green',
      price: 'RM 8.90'
    }
  ];

  const handleNotificationPress = () => {
    // Add notification handling logic here
    console.log('Notification pressed');
  };

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
          {/* Good Morning text with notification icon */}
          <View className="flex-row justify-between items-start px-[19px] mt-[20px]">
            <Text className="w-[202px] h-[42px] font-psemibold text-[28px] leading-[42px] text-[#1E1F1F]">
              Good Morning
            </Text>
            <TouchableOpacity 
              onPress={handleNotificationPress}
              className="mt-1"  // Position higher with negative margin top
            >
              <Image 
                source={require("../../assets/icons/cust_notif_icon.png")}
                className="w-7 h-7"  // Slightly larger for better touch target
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          
          {/* Customer home picture */}
          <View className="mt-[15px] w-full px-[19px]">
            <Image
              source={require("../../assets/images/customer_home_pic.png")}
              className="w-full h-[210px] rounded-2xl"
              resizeMode="cover"
            />
          </View>
          
          {/* Recommended dishes text */}
          <View className="ml-[19px] mt-[20px] flex-row h-[36px]">
            <Text className="font-psemibold text-[24px] leading-[36px] text-[#1E1F1F]">Recommended </Text>
            <Text className="font-psemibold text-[24px] leading-[36px] text-green">Dishes</Text>
          </View>
          
          {/* Recommended dish cards - using the DishCard component */}
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} onPress={() => handleDishPress(dish)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
