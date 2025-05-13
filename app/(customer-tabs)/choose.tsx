import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { icons } from "../../constants";
import { getVendors } from "../../controllers/vendorController";
import { Vendor } from "../../interfaces/vendor";
import { getDishImage, getImage } from "../../controllers/fileController";
import { getDishes } from "../../controllers/dishController";
import { Dish } from "../../interfaces/dish";
import DishCard from "../../components/DishCard";

// // Dish data type definition
// type Dish = {
//   id: string;
//   name: string;
//   image: any;
//   store: string;
//   price: string;
// };

export default function ChooseMeal() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [vendorImageUrl, setVendorImageUrl] = useState<string>();
  const [vendorDesc, setVendorDesc] = useState<string>();
  const [searchTerm, setSearchTerm] = useState<string>();

  useFocusEffect(
    React.useCallback(() => {
      const initVendors = async () => {
        const fetchedVendors = await getVendors();
        if (fetchedVendors) {
          setVendors(fetchedVendors);
        }
        const fetchedDishes = await getDishes({});
        if (fetchedDishes) {
          setDishes(fetchedDishes);
        }
      };
      initVendors();
    }, [])
  );

  useEffect(() => {
    const handleSelectVendor = async () => {
      if (selectedVendor) {
        initVendorImage(selectedVendor);
        setVendorDesc(selectedVendor.vendor_description);
        const fetchedDishes = await getDishes({
          vendor_id: selectedVendor?.id,
        });
        if (fetchedDishes) {
          setDishes(fetchedDishes);
        }
      }
    };
    handleSelectVendor();
  }, [selectedVendor]);

  const router = useRouter();

  const initVendorImage = async (vendor: Vendor) => {
    if (vendor.vendor_image_name) {
      const vendorImage = await getImage(vendor.vendor_image_name);
      if (vendorImage) {
        setVendorImageUrl(vendorImage);
      }
    }
  };

  const handleSearchItem = async (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setSelectedVendor(null);
    const fetchedDishes = await getDishes({ dish_name: searchTerm });
    if (fetchedDishes) {
      setDishes(fetchedDishes);
    }
  };

  // Store categories data
  // const storeCategories = [
  //   "Asian",
  //   "Western",
  //   "Indian",
  //   "Italian",
  //   "Japanese",
  //   "Malay",
  //   "Chinese",
  // ];

  // Asian store dishes data
  // const asianDishes: Dish[] = [
  //   {
  //     id: '1',
  //     name: 'Salmon Poke Bowl',
  //     image: require("../../assets/images/tofu_bowl_pic.png"), // Placeholder - replace with actual images
  //     store: 'Poke2U',
  //     price: 'RM 15.90'
  //   },
  //   {
  //     id: '2',
  //     name: 'Tuna Poke Bowl',
  //     image: require("../../assets/images/mixed_rice_pic.png"), // Placeholder
  //     store: 'Poke2U',
  //     price: 'RM 14.50'
  //   },
  //   {
  //     id: '3',
  //     name: 'Veggie Poke Bowl',
  //     image: require("../../assets/images/egg_salad_pic.png"), // Placeholder
  //     store: 'Poke2U',
  //     price: 'RM 12.90'
  //   }
  // ];

  // const handleDishPress = (dish: Dish) => {
  //   router.push({
  //     pathname: "/tracking",
  //     params: {
  //       name: dish.dish_name,
  //       // Convert the required image to a string ID that can be used to identify which image to display
  //       imageId: dish.id,
  //       store: dish.dish_vendor_name,
  //       price: dish.dish_price,
  //     },
  //   });
  // };

  const handleDishPress = (dish: Dish) => {
    router.push({
      pathname: "/tracking",
      params: {
        dish: JSON.stringify(dish),
      },
    });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
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
              onChangeText={(e: string) => handleSearchItem(e)}
            />
            <TouchableOpacity
              onPress={() => handleSearchItem(searchTerm ?? "")}
            >
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
              {vendors.map((vendor) => (
                <TouchableOpacity
                  key={vendor.id}
                  className="mr-3 items-center w-[85px]"
                  onPress={() => {
                    setSelectedVendor(vendor);
                    // console.log("Vendor", vendor);
                  }}
                >
                  <View
                    className={`rounded-xl w-[80px] h-[80px] items-center justify-center ${
                      selectedVendor === vendor
                        ? "bg-[#F5F5F5] border-2 border-green"
                        : "bg-[#F5F5F5]"
                    }`}
                  >
                    {/* Store icon placeholder */}
                    <View className="w-9 h-9 bg-[#E0E0E0] rounded-full items-center justify-center">
                      <Text className="font-psemibold text-[12px]">
                        {vendor.vendor_name.charAt(0)}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[12px] font-psemibold mt-2 text-center">
                    {vendor.vendor_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Store logo and description section */}
          <View className="mt-6 items-center">
            {selectedVendor && (
              <>
                {/* Store logo */}
                <View className="w-full items-center h-[167px] justify-center">
                  <Image
                    source={{ uri: vendorImageUrl }}
                    className="w-[150px] h-[150px]"
                    resizeMode="contain"
                  />
                </View>

                {/* Store description */}
                <View className="px-[19px] mt-2 mb-4">
                  <Text className="text-center font-pregular text-[14px] text-[#555]">
                    {vendorDesc}
                  </Text>
                </View>
              </>
            )}

            {/* Section title */}
            <View className="self-start ml-[19px] mt-2 mb-2">
              <Text className="font-psemibold text-[20px] text-[#1E1F1F]">
                Menu
              </Text>
            </View>

            {/* Dishes from this store */}
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onPress={() => handleDishPress(dish)}
              />
            ))}
          </View>

          {/* Placeholder for other stores */}
          {/* {!selectedStore && (
            <View className="mt-6 items-center px-[19px]">
              <Text className="text-center font-pregular text-[16px] text-[#555]">
                {selectedStore} restaurant information will be displayed here.
              </Text>
            </View>
          )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
