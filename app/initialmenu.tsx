import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import DishItem from '../components/DishItem'
import { RouteParamInput, useGlobalSearchParams, useRouter } from 'expo-router'

type Dish = {
  id: string;
  dishName: string;
  dishPrice: number;
  thumbnailImage: string;
};

const initialmenu = () => {
  const { vendorUri, newDish } = useGlobalSearchParams();
  const router = useRouter();

  const [dishes, setDishes] = useState<Dish[]>([]);

  // Function to add a new dish to the list
  const addNewDish = (newDish: Dish) => {
    if (!dishes.some(dish => dish.id === newDish.id)){
        setDishes((prevDishes) => {
            const updatedDishes = [...prevDishes, newDish];
            console.log("im in")
            return updatedDishes;
        });
    }
  };

  // Function to delete a dish by ID
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

  useEffect(() => {
    console.log("Current Dishes:", dishes);
  }, [dishes]);

  return (
    <View className="space-y-3 p-6 justify-center bg-white flex-1">
      <Text className='font-semibold text-2xl text-black'>Let's populate your menu</Text>

      {/* Button to create a new dish */}
      <TouchableOpacity
        className='bg-[#74B318] py-3 rounded-full justify-center items-center mt-5 shadow-lg'
        onPress={() => router.push({ pathname: '/createdish', params: { prevPage: '/initialmenu' } })}
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

      {/* Create Later / Next Step Buttons */}
      <View className="mt-6">
        <TouchableOpacity onPress={() => router.push({ pathname: '/menu' })}>
          <Text className="text-[#74B318] text-center text-lg mb-4 underline">Create later?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#74B318] rounded-full py-4 justify-center items-center shadow-md"
          onPress={() => router.push({ pathname: '/menu' })}
        >
          <Text className="text-white font-semibold text-lg">Next step</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default initialmenu;
