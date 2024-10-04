import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteParamInput, useGlobalSearchParams, useRouter } from 'expo-router';
import DishItem from '../components/DishItem';

type Dish = {
  id: string;
  dishName: string;
  dishPrice: number;
  thumbnailImage: string;
};

export default function menu() {
  const { vendorName, vendorDesc, vendorUri, menudDishes , newDish} = useGlobalSearchParams();
  const router = useRouter();
  
  // Logging to check parsed dishes
  console.log("Parsed Dishes");
  console.log(menudDishes);

  const validVendorName = Array.isArray(vendorName) ? vendorName[0] : vendorName;
  const validVendorDesc = Array.isArray(vendorDesc) ? vendorDesc[0] : vendorDesc;
  const validVendorUri = Array.isArray(vendorUri) ? vendorUri[0] : vendorUri;
  const validMenuDishes = Array.isArray(menudDishes) ? menudDishes[0] : menudDishes;

  const parsedDishes = menudDishes ? JSON.parse(validMenuDishes) : [];

  const [dishes, setDishes] = useState<Dish[]>(parsedDishes);

  const addNewDish = (newDish: Dish) => {
    if (!dishes.some(dish => dish.id === newDish.id)){
        setDishes((prevDishes) => {
            const updatedDishes = [...prevDishes, newDish];
            return updatedDishes;
        });
    }
  };

  const deleteDish = (id: string) => {
    setDishes((prevDishes) => prevDishes.filter(dish => dish.id !== id));
  };

  // Function to edit a dish (navigates to edit page)
  const editDish = (dish: RouteParamInput<string> | undefined) => {
    router.push({
      pathname: '/editdish',
      params: { ...dish }
    });
  };

  useEffect(() => {
    if (newDish) {
      const parsedDish = typeof newDish === 'string' ? JSON.parse(newDish) : null;
      if (parsedDish) {
        addNewDish(parsedDish);
      }
    }
  }, [newDish]);

  // Check if any of the key fields are missing
  const isVendorInfoMissing = !validVendorName || !validVendorDesc || !validVendorUri;

  return (
    <View className="bg-white flex-1">
      {/* Conditional rendering for missing vendor information */}
      {isVendorInfoMissing ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg font-semibold">Vendor information is missing!</Text>
          <Text className="text-gray-400 text-center mt-2">
            Please provide the necessary details to view the menu.
          </Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <Text className='text-semibold text-2xl mt-5 ml-3'>Hello {validVendorName}</Text>
          <View className='space-y-2 justify-center items-center'>
            {/* Display placeholder image if validVendorUri is empty */}
            <Image 
              source={{ uri: validVendorUri || 'https://via.placeholder.com/150' }} 
              className='w-40 h-40 mt-10' 
            />
          </View>
          <Text className='text-semibold text-center px-5 mt-4'>{validVendorDesc}</Text>

          {/* Create new dish button */}
          <View className='px-4 mt-6'>
            <TouchableOpacity 
              className='bg-[#74B318] py-3 rounded-md justify-center items-center'
              onPress={() =>router.push({ pathname: '/createdish', params: { prevPage: '/menu' } })}
            >
              <Text className='text-white text-lg font-semibold'>
                Create new dish + 
              </Text> 
            </TouchableOpacity>
          </View>

          {/* Dish list */}
          <ScrollView className="h-60 mt-5" showsVerticalScrollIndicator={false}>
            {dishes.length === 0 ? (
              <Text className="text-gray-400 text-center mt-4">No dishes added yet.</Text>
            ) : (
              dishes.map((dish) => (
                <DishItem
                  key={dish.id} 
                  dish={dish}
                  onDelete={() => deleteDish(dish.id)}
                  onEdit={() => editDish(dish)}
                />
              ))
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}
