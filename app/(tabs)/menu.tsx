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
import { getVendorByUser } from "../../controllers/vendorController";
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

  const setDishMenu = async () => {
      const menu_result = await getDishes({vendor_id: vendorId})
      if(menu_result){
        setVendorDishes(menu_result)
      }
  }

  useEffect(() => {
      const setVendorValues = async () => {
        const result = await getVendorByUser();
        console.log(`Testing result: ${result}`)
        if (result) {
          console.log("TESSSS VALID")
          setVendorId(result.id!)
          setVendorName(result.vendor_name);
          setVendorDescription(result.vendor_description);
          if (result.vendor_image_url) {
            setUri(result.vendor_image_url);
            // console.log("thumbnailimage", editUri);
          }
        }
      };
      setVendorValues();  
        //console.log(`Refresh with new dish menu: ${JSON.stringify(vendorDishes)}`)

        //console.log(`Curren dishes: ${JSON.stringify(vendorDishes)}`)
      }, []);

  // Getting parameters from the editvendor Page
  const { newVendorName, newVendorDesc, newImg } = useGlobalSearchParams();
  console.log(`name: ${newVendorName}`)
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
      const deleteDishSuccess = await deleteDish(dish)
    };

  // Function to edit a dish (Not functionable yet just redirect to different page)
  const editDish = (dish: Dish | null, dish_url?: string) => {
      router.push({
        pathname: '/editdish',
        params: {
          ...dish,
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

  return (
    <View className="bg-white flex-1">
      {/* Top Header with icon on the right */}
      <View className="flex-row justify-between items-center mt-14 px-5">
        {/* Checking if valid Vendor name, if not show the default version */}
        <Text className="text-3xl font-psemibold text-primary mb-2">
          {vendorName ? `Hello, ${vendorName}!` : "Hello there!"}
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/editvendor",
              params: { prevPage: "/menu" },
            })
          }
          style={{ backgroundColor: '#e0e7ef', borderRadius: 999, padding: 8 }}
        >
          <Image
            style={{ width: 22, height: 22, tintColor: '#74B318' }}
            source={require("../../assets/icons/pen.png")}
          />
        </TouchableOpacity>
      </View>

      {/* Vendor thumbnail image */}
      <View className="justify-center items-center mt-8 mb-2">
        <Image
          source={{ uri: vendorUri || "https://via.placeholder.com/150" }}
          style={{ width: 120, height: 120, borderRadius: 10, borderWidth: 3, borderColor: '#e0e7ef', backgroundColor: '#f3f4f6' }}
        />
      </View>

      {/* Vendor description */}
      <Text className="font-semibold text-center px-8 mt-2 text-gray-700 text-base">
        {vendorDesc || "We serve because we served"}
      </Text>

      {/* Create new dish button */}
      <View className="px-6 mt-7">
        <TouchableOpacity
          style={{ backgroundColor: '#74B318', paddingVertical: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#74B318', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 }}
          onPress={() =>
            router.push({
              pathname: "/createdish",
              params: { prevPage: "/menu", vendorId: vendorId },
            })
          }
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 }}>
            Create new dish +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dish list */}
      <ScrollView style={{ flex: 1, marginTop: 24, paddingHorizontal: 12 }} showsVerticalScrollIndicator={false}>
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
