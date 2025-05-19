import React, { useEffect, useState } from 'react';
import { DishIngredient } from '../interfaces/dishIngredient';

import { getIngredientCarbon } from '../controllers/ingredientController';
import { ActivityIndicator, Text, View } from 'react-native';
import { JoinedDishIngredient } from '../interfaces/joinedDishIngredient';
import { joinDishIngredient } from '../controllers/dishIngredientJoinController';

type CalculateCarbonProp = {
    ingredientList?: DishIngredient[];
    joinedIngredientList?: JoinedDishIngredient[];
    onCarbonCalculated?: (carbon: number) => void;  // Add callback prop
}

const CalculateTotalCarbon: React.FC<CalculateCarbonProp> = ({ ingredientList, joinedIngredientList, onCarbonCalculated  }) => {
    const [totalCarbon, setTotalCarbon] = useState<number | null>(null);
    useEffect(() =>{

        if(ingredientList){
            const fetchCarbonData = async () => {
                let total = 0;
    
                for( const item of ingredientList){
                    const result = await getIngredientCarbon(item.ingredient_id as string)
    
                    const carbonValue = (result?.ingredient_footprint * item.ingredient_amount! as number) / 1000
                    total += carbonValue
                }
                
                onCarbonCalculated?.(total);
                setTotalCarbon(total)
            };
    
            fetchCarbonData()
        }
        else if(joinedIngredientList){
            const fetchJoinedCarbonData = async () => {
                let total = 0;
    
                for( const item of joinedIngredientList){
                    const result = await getIngredientCarbon(item.ingredient.id as string)
    
                    const carbonValue = (result?.ingredient_footprint * item.ingredient_amount! as number) / 1000
                    total += carbonValue
                }

                onCarbonCalculated?.(total);
                setTotalCarbon(total)
            };
    
            fetchJoinedCarbonData()
        }
    }, [ingredientList, joinedIngredientList])
    
    return(
        <View className="p-4">
    <Text className="text-lg font-bold">
      Total Carbon Footprint: {(totalCarbon || 0).toFixed(2)} gCO₂
    </Text>
  
</View>
    )
}

export default CalculateTotalCarbon