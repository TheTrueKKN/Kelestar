import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  useGlobalSearchParams,
  useRouter,
  useFocusEffect,
} from "expo-router";
import { useCallback } from "react";
import DishItem from "../../components/DishItem";
import { getVendorByUser, updateVendorGreenScore } from "../../controllers/vendorController";
import { Dish } from "../../interfaces/dish";
import { deleteDish, getDishes } from "../../controllers/dishController";


export default function Menu() {

  const [vendorId, setVendorId] = useState("");
   const [vendorName, setVendorName] = useState(""); // Vendor name state
   const [vendorDesc, setVendorDescription] = useState(""); // Vendor description state
   const [vendorUri, setUri] = useState(""); // Thumbnail image state
   const [vendorDishes, setVendorDishes] = useState<Dish[]>([]);
   // Getting parameters from Initial menu page
   const { menudDishes, newDish } = useGlobalSearchParams();
   const [loading, setLoading] = useState(false);

  const setDishMenu = async () => {
      const menu_result = await getDishes({vendor_id: vendorId})
      if(menu_result){
        setVendorDishes(menu_result)
      }
  }

 

  useEffect(() => {
      const setVendorValues = async () => {
        setLoading(true)
        const result = await getVendorByUser();
        console.log(`Testing result: ${result}`)
        if (result) {
          //console.log("TESSSS VALID")
          setVendorId(result.id!)
          setVendorName(result.vendor_name);
          setVendorDescription(result.vendor_description);
          if (result.vendor_image_url) {
            setUri(result.vendor_image_url);
            // console.log("thumbnailimage", editUri);
          }
        }
        setLoading(false)
      };
      setVendorValues();  
      
      }, []);

  // Getting parameters from the editvendor Page
  const { newVendorName, newVendorDesc, newImg } = useGlobalSearchParams();
  //console.log(`vendor name: ${newVendorName}`)
  const router = useRouter();

  // Parsing the menu dishes item
  const parsedDishes = menudDishes
    ? JSON.parse(Array.isArray(menudDishes) ? menudDishes[0] : menudDishes)
    : [];
  const [dishes, setDishes] = useState<Dish[]>(parsedDishes);

  // Helper function to validate and extract single value
  const validateParam = (
    param: string | string[] | undefined
  ): string | undefined => {
    return Array.isArray(param) ? param[0] : param;
  };

  // Function to delete a dish
  const removeDish = async (dish: Dish) => {
      setVendorDishes((prevDishes) => prevDishes.filter(allDish => allDish.id !== dish.id));
      await updateVendorGreenScore(vendorId)
      const deleteDishSuccess = await deleteDish(dish)
    };

  // Function to edit a dish (Not functionable yet just redirect to different page)
  const editDish = (dish: Dish | null, dish_url?: string) => {
    if (!dish) return; 
     const { dish_vendor, dish_ingredient, ...serializableDish } = dish;
      router.push({
        pathname: '/editdish',
        params: {
          ...serializableDish,
          dish_url: dish_url ?? '',
          prev_page: "/menu"
        }
      });
      console.log(`Current dish being edited: ${JSON.stringify(dish)}`)
    };


  // Update vendor details when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setVendorName(validateParam(newVendorName || vendorName) as string);
      setVendorDescription(validateParam(newVendorDesc || vendorDesc) as string);
      setUri(validateParam(newImg || vendorUri) as string);

      setDishMenu()


    }, [newVendorName, vendorName, newVendorDesc, vendorDesc, newImg, vendorUri])
  );

   if (loading) {
      return <Text style={{ textAlign: "center", marginTop: 32 }}>Loading menu...</Text>;
  }

  return (
    <View className="bg-white flex-1">
      {/* Top Header with icon on the right */}
      <View className="flex-row justify-between items-center mt-12 ml-3 mr-3">
        {/* Checking if valid Vendor name, if not show the default version */}
        <Text className="font-bold text-2xl">
          {vendorName ? `Hello ${vendorName}!` : "Hello there!!"}
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/editvendor",
              params: { prevPage: "/menu" },
            })
          }
        >
          <Image
            className="w-5 h-5 tintColour-white"
            source={require("../../assets/icons/pen.png")} // Replace with your icon
          />
        </TouchableOpacity>
      </View>

      {/* Same goes for the thumbnail image */}
      <View className="space-y-2 justify-center items-center">
        <Image
          source={{ uri: vendorUri || "https://via.placeholder.com/150" }}
          className="w-40 h-40 mt-10"
        />
      </View>

      {/* Display the previously given vendor description, if not valud then display a default version */}
      <Text className="font-bold text-center px-5 mt-4">
        {vendorDesc || "We serve because we served"}
      </Text>

      {/* Create new dish button */}
      <View className="px-4 mt-6">
        <TouchableOpacity
          className="bg-[#74B318] py-3 rounded-md justify-center items-center"
          onPress={() =>
            router.push({
              pathname: "/createdish",
              params: { prevPage: "/menu" , vendorId: vendorId},
            })
          }
        >
          <Text className="text-white text-lg font-bold">
            Create new dish +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dish list */}
      <ScrollView className="h-60 mt-5" showsVerticalScrollIndicator={false}>
        {vendorDishes.length === 0 ? (
          <Text className="text-gray-400 text-center mt-4">
            No dishes added yet.
          </Text>
        ) : (
          vendorDishes.map((dish) => (
            <DishItem
              key={dish.id}
              dish={dish}
              onDelete={() => removeDish(dish)}
              onEdit={(dish, dish_url) => editDish(dish, dish_url)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
