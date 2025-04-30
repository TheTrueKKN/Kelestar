import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Dish } from "../interfaces/dish";
import { GestureResponderEvent } from 'react-native';
import { getDishImage } from '../controllers/fileController';




type DishItemProps = {
  dish: Dish;
  onEdit: (dish: Dish, dish_url?: string) => void;
  onDelete: () => void; 
};

const DishItem: React.FC<DishItemProps> = ({ dish, onEdit, onDelete }) => {
  const { dish_name, dish_price, dish_image_name, dish_total_carbon } = dish;  // Destructure correctly

  const [dishUrl, setDishUrl] = useState<string | null>(null);
    
    useEffect(() => {
    const fetchImage = async () => {
      if (dish_image_name) {
        const url = await getDishImage(dish_image_name);
        setDishUrl(url);
      }
    };

    fetchImage();
  }, [dish_image_name]);
  //console.log(`Data passed in: ${JSON.stringify(dish)}`)
  //console.log(`Current image URl: ${dishUrl}`)
  return (
    <View style={{ backgroundColor: '#F2F2F2' }} className="p-4 rounded-lg mb-2 flex-row items-center border border-gray-100">

      {/* Dish image on the left side */}
      {dishUrl ? (
        <Image source={{ uri: dishUrl }} className="w-24 h-24 rounded mr-4" />
      ) : (
        <Text className="text-gray-400 italic mr-4">No image available</Text>
      )}

      {/* Dish name and price side by side with the image */}
      <View className="flex-1">
        <Text className="text-lg font-semibold">{dish_name}</Text>
        <Text className="text-gray-500">RM {dish_price}</Text>
        <Text className="text-gray-500">{dish_total_carbon?.toFixed(3)} gCO₂</Text>
      </View>

      {/* Edit and Delete buttons in a row */}
      <View className="flex-row justify-end">
        <TouchableOpacity onPress={() => onEdit(dish, dishUrl ?? '')} className="mr-4">
          <Text className="text-blue-500">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete}>
          <Text className="text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DishItem;
