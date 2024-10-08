import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';




type Dish = {
  id: string;
  dishName: string;      // Correct the name from 'name' to 'dishName'
  dishPrice: number;  // Adjust the type to string or number for 'dishPrice'
  thumbnailImage: string; // Correct the name from 'img' to 'thumbnailImage'
};

type DishItemProps = {
  dish: Dish;
  onEdit: () => void; 
  onDelete: () => void; 
};

const DishItem: React.FC<DishItemProps> = ({ dish, onEdit, onDelete }) => {
  const { dishName, dishPrice, thumbnailImage } = dish;  // Destructure correctly

  const renderLeftActions = () => (
    <TouchableOpacity onPress={onDelete} className="flex items-center justify-center bg-red-500 w-20">
      <Text className="text-white font-bold">Delete</Text>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity onPress={onEdit} className="flex items-center justify-center bg-blue-500 w-20">
      <Text className="text-white font-bold">Edit</Text>
    </TouchableOpacity>
  );
  return (
    <View className="p-4 bg-gray-300 rounded-lg mb-2 flex-row items-center">
      {/* Dish image on the left side */}
      {thumbnailImage ? (
        <Image source={{ uri: thumbnailImage }} className="w-24 h-24 rounded mr-4" />
      ) : (
        <Text className="text-gray-400 italic mr-4">No image available</Text>
      )}

      {/* Dish name and price side by side with the image */}
      <View className="flex-1">
        <Text className="text-lg font-semibold">{dishName}</Text>
        <Text className="text-gray-500">RM {dishPrice}</Text>
      </View>

      {/* Edit and Delete buttons in a row */}
      <View className="flex-row justify-end">
        <TouchableOpacity onPress={onEdit} className="mr-4">
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
