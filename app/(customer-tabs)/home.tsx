import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { getDishes } from "../../controllers/dishController";
import { Dish } from "../../interfaces/dish";
import { getDishImage } from "../../controllers/fileController";
import DishCard from "../../components/DishCard";
import {
  getCustomerByUser,
  insertCustomer,
} from "../../controllers/customerController";
import { Customer } from "../../interfaces/customer";
import Budget from "../budget";

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
  const [customer, setCustomer] = useState<Customer | null>();
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const initCustomer = async () => {
        let fetchedCustomer = await getCustomerByUser();
        if (!fetchedCustomer) {
          const insertCustomerSuccess = await insertCustomer();
          if (insertCustomerSuccess) {
            fetchedCustomer = await getCustomerByUser();
          }
        }
        setCustomer(fetchedCustomer);
        if (!fetchedCustomer?.customer_carbon_budget) {
          // router.push("/budget")
          setShowModal(true);
        }

        // console.log("Fetched customer:", fetchedCustomer);
      };
      initCustomer();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
    const initDishes = async () => {
      const fetchedDishes = await getDishes({active: true});
      if (fetchedDishes) {
        setDishes(fetchedDishes);
      }
    };
    initDishes();
    }, [])
  );


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
    console.log("Notification pressed");
  };

  const handleDishPress = (dish: Dish) => {
    router.push({
      pathname: "/tracking",
      params: {
        dish: JSON.stringify(dish),
      },
    });
  };

  return (
    <>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="relative flex-1">
            {/* Good Morning text with notification icon */}
            <View className="flex-row justify-between items-start px-[19px] mt-[20px]">
              <Text className="w-[202px] h-[42px] font-psemibold text-[28px] leading-[42px] text-[#1E1F1F]">
                Good Morning
              </Text>
              <TouchableOpacity
                onPress={handleNotificationPress}
                className="mt-1" // Position higher with negative margin top
              >
                <Image
                  source={require("../../assets/icons/cust_notif_icon.png")}
                  className="w-7 h-7" // Slightly larger for better touch target
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
              <Text className="font-psemibold text-[24px] leading-[36px] text-[#1E1F1F]">
                Recommended{" "}
              </Text>
              <Text className="font-psemibold text-[24px] leading-[36px] text-green">
                Dishes
              </Text>
            </View>

            {/* Recommended dish cards - using the DishCard component */}
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onPress={() => handleDishPress(dish)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/30 backdrop-blur-sm">
          {/* Popup Content */}
          <View className="bg-white h-3/5 w-80 p-6 rounded-lg shadow-lg shadow-gray-200">
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="absolute top-0 right-0 h-20 w-20 rounded-full z-10"
            >
              <Text className="text-black text-xl font-bold absolute top-4 right-4">
                ✕
              </Text>
            </TouchableOpacity>
            <Budget handleBudgetSaved={() => setShowModal(false)}></Budget>
          </View>
        </View>
      </Modal>
    </>
  );
}
