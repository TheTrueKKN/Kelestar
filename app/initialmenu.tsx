import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from "@react-navigation/native";

import DishItem from '../components/DishItem'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { getVendorByUser } from '../controllers/vendorController';

// Newly added
import { getDishes, deleteDish } from "../controllers/dishController";
import { Dish } from "../interfaces/dish";
import { withRepeat } from 'react-native-reanimated';
import { supabase } from '../lib/supabase';


const InitialMenu = () => {
  // Getting the parameters from vendor Detail page
  // const { vendorName , vendorDesc, vendorUri, newDish } = useGlobalSearchParams();
  const { newDish } = useGlobalSearchParams();
  const router = useRouter();

  // Keep track of the dishes made
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [vendorName, setVendorName] = useState(""); // Vendor name state
  const [thumbnailImage, setThumbnailImage] = useState(""); // Thumbnail image state
  const [vendorDescription, setVendorDescription] = useState(""); // Vendor description state
  const [vendorId, setVendorId] = useState("");

  // Function to add a new dish to the list
  const addNewDish = (newDish: Dish) => {
    if (!dishes.some(dish => dish.id === newDish.id)){
        setDishes((prevDishes) => {
            const updatedDishes = [...prevDishes, newDish];
            return updatedDishes;
        });
    }
  };

  const convertToDishFormat = (data: Dish[]) => {
    return data.map((item) => ({
      id: item.id,
      dish_name: item.dish_name,
      dish_price: item.dish_price,
      dish_image_name: item.dish_image_name,
      dish_vendor_id: item.dish_vendor_id,
    }));
  };

  const getVendorDishes = async () => {
    try {
      // Fetch dishes from Supabase (Assuming getDishes is defined elsewhere)
      const fetchedDishes = await getDishes(vendorId); 
      // console.log('Fetched dishes:', fetchedDishes);

      // If fetched data is valid, map it to the Dish format
      if (fetchedDishes && Array.isArray(fetchedDishes)) {
        const dishes = convertToDishFormat(fetchedDishes); // Convert to the correct format
        setDishes(dishes); // Set the fetched and converted dishes to the state
        // console.log(`DEEEZ DISHES: ${JSON.stringify(dishes)}`)
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

    useEffect(() => {
      const setVendorValues = async () => {
        const result = await getVendorByUser();
        
        //console.log(`Vendor detail: ${JSON.stringify(result)}`)
        if (result) {
          setVendorName(result.vendor_name);
          setVendorDescription(result.vendor_description);
          setVendorId(result.id ?? "");
          if (result.vendor_image_url) {
            setThumbnailImage(result.vendor_image_url);
            // console.log("thumbnailimage", editThumbnailImage)
          }
        }
      };
      setVendorValues();

      getVendorDishes();
    }, []);

  // Function to delete a dish by ID
  const removeDish = async (dish: Dish) => {
    setDishes((prevDishes) => prevDishes.filter(allDish => allDish.id !== dish.id));
    const deleteDishSuccess = await deleteDish(dish)
  };

  // Function to edit a dish (navigates to edit page)
  const editDish = (dish: Dish | null, dish_url?: string) => {
    router.push({
      pathname: '/editdish',
      params: {
        ...dish,
        dish_url: dish_url ?? ''
      }
    });
    console.log(`Current dish being edited: ${JSON.stringify(dish)}`)
  };

  // Whenever got an update to new Dish, add the dish into the array
  useEffect(() => {
    if (newDish) {
      const parsedDish = typeof newDish === 'string' ? JSON.parse(newDish) : null;
      if (parsedDish) {
        addNewDish(parsedDish);
      }
    }
  }, [newDish]);

  // Just for checking it the dish has been added into the array or not (Can be commented out if not required)
  useEffect(() => {
    console.log("Current Dishes:", JSON.stringify(dishes, null, 2));
  }, [dishes]);


  return (
    <View className="space-y-3 p-6 justify-center bg-white flex-1">
      <Text className='font-semibold text-2xl text-black'>Let's populate your menu</Text>

      {/* Button to create a new dish */}
      <TouchableOpacity
        className='bg-[#74B318] py-3 rounded-full justify-center items-center mt-5 shadow-lg'
        onPress={() => router.push({ pathname: '/createdish', params: { prevPage: '/initialmenu', vendorId: vendorId } })}
      >
        <Text className='text-white text-lg font-semibold'>
          + Create new dish
        </Text>
      </TouchableOpacity>

      <Text className='font-bold text-xl text-black mb-3'>Dish List</Text>

      {/* Scrollable list of dishes */}
      <ScrollView className="h-60" showsVerticalScrollIndicator={false}>
        {dishes.length === 0 ? (
          <Text className="text-gray-400 text-center mt-4">No dishes added yet.</Text>
        ) : 
        (
          dishes.map((dish) => (
            <DishItem
              key={dish.id} 
              dish={dish}
              onDelete={() => removeDish(dish!)} 
              onEdit={(dish, dish_url) => editDish(dish, dish_url)}
            />
          ))
        )
        }
      </ScrollView>

      {/* Create Later / Next Step Buttons */}
      <View className="mt-6">
        <TouchableOpacity onPress={() => router.replace({ pathname: '/menu' })}>
          <Text className="text-[#74B318] text-center text-lg mb-4 underline">Create later?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#74B318] rounded-full py-4 justify-center items-center shadow-md"
          onPress={() => router.replace({ pathname: '/menu' , params:{vendorName, vendorDescription, thumbnailImage, menudDishes:JSON.stringify(dishes)}})}
        >
          <Text className="text-white font-semibold text-lg">Next step</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InitialMenu;
