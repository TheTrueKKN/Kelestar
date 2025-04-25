import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DishIngredient } from '../interfaces/dishIngredient';
import { getIngredientName } from '../controllers/ingredientController';


type DishIngredientItemProp = {
  dishIngredient: DishIngredient;
  onDelete: () => void;
};

const DishIngredientItem: React.FC<DishIngredientItemProp> = ({ dishIngredient, onDelete }) => {
  const { ingredient_id, ingredient_amount } = dishIngredient;

  const [ingrendientName, setIngredientName] = useState('')

  useEffect(() => {
      const fetchIngredientName = async () => {
        if (ingredient_id) {
            const response = await getIngredientName(ingredient_id);
            const name = response?.[0]?.ingredient_name || "Unknown Ingredient";
            setIngredientName(name);
          console.log(`Ingredient name returned: ${JSON.stringify(response)}`)
        }
      };
  
      fetchIngredientName();
    }, []);
  return (
    <View className="p-4 bg-[#F2F2F2] rounded-lg mb-2 border border-gray-300">
      <Text className="text-lg font-semibold">{ingrendientName}</Text>
      <Text className="text-gray-500">{ingredient_amount}g</Text>

      <View className="flex-row justify-end">
              <TouchableOpacity onPress={onDelete}>
                <Text className="text-red-500">Delete</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
};

export default DishIngredientItem;
