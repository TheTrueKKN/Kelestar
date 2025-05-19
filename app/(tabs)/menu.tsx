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
   const [vendorDishes, setVendorDishes] = useState<Dish[]>([]);
   // Getting parameters from Initial menu page
   const { menudDishes, newDish } = useGlobalSearchParams();
   const [loading, setLoading] = useState(false);

  const setDishMenu = async () => {
      console.log(`Current vendor Id: ${vendorId}`)
      const menu_result = await getDishes({dish_vendor_id: vendorId, active: true})
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

  // Function to delete a dish
  const removeDish = async (dish: Dish) => {
      setVendorDishes((prevDishes) => prevDishes.filter(allDish => allDish.id !== dish.id));
      await updateVendorGreenScore(vendorId)
      const deleteDishSuccess = await deleteDish(dish)
    };

  // Function to edit a dish (Not functionable yet just redirect to different page)
  const editDish = (dish: Dish | null, dish_url?: string) => {
    if (!dish) return; 
     const { dish_vendor, dish_ingredient, dish_nutrition, active, ...serializableDish } = dish;
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
      // setVendorName(validateParam(newVendorName || vendorName) as string);
      // setVendorDescription(validateParam(newVendorDesc || vendorDesc) as string);
      // setUri(validateParam(newImg || vendorUri) as string);

      setDishMenu()


    }, [vendorId])
  );

   if (loading) {
      return <Text style={{ textAlign: "center", marginTop: 32 }}>Loading menu...</Text>;
  }

  return (
    <View className="bg-white flex-1">
      {/* Top Header with icon on the right */}
      <View className="mt-12 mx-3 items-center justify-center">
        <Text className="text-3xl font-pbold text-primary mb-2">
          Your Dishes
        </Text>
      </View>


      {/* Same goes for the thumbnail image */}
      <View className="space-y-2 justify-center items-center">
        {/* <Image
          source={{ uri: vendorUri || "https://via.placeholder.com/150" }}
          className="w-40 h-40 mt-10"
        /> */}
      </View>

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
