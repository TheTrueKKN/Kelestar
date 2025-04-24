import React from 'react';
import { View, Text } from 'react-native';
import { DishIngredient } from '../interfaces/dishIngredient';

type DishIngredientItemProp = {
  dishIngredient: DishIngredient;
};

const DishIngredientItem: React.FC<DishIngredientItemProp> = ({ dishIngredient }) => {
  const { ingredient_id, ingredient_amount } = dishIngredient;

  return (
    <View className="p-4 bg-[#F2F2F2] rounded-lg mb-2 border border-gray-300">
      <Text className="text-lg font-semibold">{ingredient_id}</Text>
      <Text className="text-gray-500">{ingredient_amount}</Text>
    </View>
  );
};

export default DishIngredientItem;
