import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteParamInput, useGlobalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import DishItem from '../components/DishItem';

type Dish = {
  id: string;
  dishName: string;
  dishPrice: number;
  thumbnailImage: string;
};

export default function Menu() {
  const { vendorName, vendorDesc, vendorUri, menudDishes, newDish } = useGlobalSearchParams();
  const { newVendorName, newVendorDesc, newImg } = useGlobalSearchParams();
  const router = useRouter();

  const [validVendorName, setValidVendorName] = useState<string | undefined>(undefined);
  const [validVendorDesc, setValidVendorDesc] = useState<string | undefined>(undefined);
  const [validVendorUri, setValidVendorUri] = useState<string | undefined>(undefined);

  const parsedDishes = menudDishes ? JSON.parse(Array.isArray(menudDishes) ? menudDishes[0] : menudDishes) : [];
  const [dishes, setDishes] = useState<Dish[]>(parsedDishes);

  // Helper function to validate and extract single value
  const validateParam = (param: string | string[] | undefined): string | undefined => {
    return Array.isArray(param) ? param[0] : param;
  };

  const addNewDish = (newDish: Dish) => {
    if (!dishes.some(dish => dish.id === newDish.id)) {
      setDishes((prevDishes) => [...prevDishes, newDish]);
    }
  };

  const deleteDish = (id: string) => {
    setDishes((prevDishes) => prevDishes.filter(dish => dish.id !== id));
  };

  const editDish = (dish: RouteParamInput<string> | undefined) => {
    router.push({
      pathname: '/editdish',
      params: { ...dish }
    });
  };

  // Update vendor details when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setValidVendorName(validateParam(newVendorName || vendorName));
      setValidVendorDesc(validateParam(newVendorDesc || vendorDesc));
      setValidVendorUri(validateParam(newImg || vendorUri));

      if (newDish) {
        const parsedDish = typeof newDish === 'string' ? JSON.parse(newDish) : null;
        if (parsedDish) {
          addNewDish(parsedDish);
        }
      }
    }, [vendorName, vendorDesc, vendorUri, newVendorName, newVendorDesc, newImg, newDish])
  );

  return (
    <View className="bg-white flex-1">
      {/* Top Header with icon on the right */}
      <View className="flex-row justify-between items-center mt-5 ml-3 mr-3">
        <Text className='font-bold text-2xl'>{validVendorName ? `Hello ${validVendorName}!` : 'Hello there!!'}</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '/editvendor', params: { prevPage: '/menu' } })}>
          <Image className="w-5 h-5 tintColour-white"
            source={require('../assets/icons/pen.png')} // Replace with your icon 
          />
        </TouchableOpacity>
      </View>

      <View className='space-y-2 justify-center items-center'>
        <Image 
          source={{ uri: validVendorUri || 'https://via.placeholder.com/150' }} 
          className='w-40 h-40 mt-10' 
        />
      </View>

      <Text className='font-bold text-center px-5 mt-4'>
        {validVendorDesc || 'Happy to serve you'}
      </Text>

      {/* Create new dish button */}
      <View className='px-4 mt-6'>
        <TouchableOpacity 
          className='bg-[#74B318] py-3 rounded-md justify-center items-center'
          onPress={() => router.push({ pathname: '/createdish', params: { prevPage: '/menu' } })}
        >
          <Text className='text-white text-lg font-bold'>
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
    </View>
  );
}
