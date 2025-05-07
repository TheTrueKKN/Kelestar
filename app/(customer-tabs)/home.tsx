import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { getDishes } from '../../controllers/dishController';
import { Dish } from '../../interfaces/dish';
import { getDishImage } from '../../controllers/fileController';
import DishCard from '../../components/DishCard';


// Dish data type definition
// type Dish = {
//   id: string;
//   name: string;
//   image: any;
//   store: string;
//   price: string;
// };

export default function CustomerHome() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    const initDishes = async () => {
      const fetchedDishes = await getDishes({});
      if (fetchedDishes) {
        setDishes(fetchedDishes);
      }
    };
    initDishes();
  }, []);

  const router = useRouter();

  // Dish data array
  // const dishes: Dish[] = [
  //   {
  //     id: '1',
  //     dish_name: 'Tofu Bowl',
  //     dish_image_name: require("../../assets/images/tofu_bowl_pic.png"),
  //     dish_vendor_name: 'Healthy Eats',
  //     dish_price: 'RM 12.90'
  //   },
  //   {
  //     id: '2',
  //     dish_name: 'Mixed Rice',
  //     dish_image_name: require("../../assets/images/mixed_rice_pic.png"),
  //     dish_vendor_name: 'Asian Delights',
  //     dish_price: 'RM 10.50'
  //   },
  //   {
  //     id: '3',
  //     dish_name: 'Egg Salad',
  //     dish_image_name: require("../../assets/images/egg_salad_pic.png"),
  //     dish_vendor_name: 'Fresh & Green',
  //     dish_price: 'RM 8.90'
  //   }
  // ];

  const handleNotificationPress = () => {
    // Add notification handling logic here
    console.log('Notification pressed');
  };

  const handleDishPress = (dish: Dish) => {
    router.push({
      pathname: "/tracking",
      params: {
        dish: JSON.stringify(dish)
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
