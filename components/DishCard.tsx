import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { getDishImage } from "../controllers/fileController";
import { Dish } from "../interfaces/dish";

const DishCard = ({ dish, onPress }: { dish: Dish; onPress: () => void }) => {
  const [dishUrl, setDishUrl] = useState<string>();
  useEffect(() => {
    const initDishImage = async () => {
      if (dish.dish_image_name) {
        const dishImage = await getDishImage(dish.dish_image_name);
        if (dishImage) {
          setDishUrl(dishImage);
          dish.dish_image_url = dishImage;
        }
      }
    };
    initDishImage();
  }, []);
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-[19px] mt-[15px] w-auto h-[128px] p-3 bg-[#F2F2F2] rounded-2xl flex-row"
    >
      <Image
        source={{ uri: dishUrl }}
        className="w-[100px] h-[100px] rounded-l-md"
        resizeMode="cover"
      />

      <View className="flex-1 p-4 justify-center">
        <Text className="font-psemibold text-[18px] text-[#1E1F1F]">
          {dish.dish_name}
        </Text>
        <Text className="font-pregular text-[14px] text-gray-500 mt-1">
          {dish.dish_vendor?.vendor_name}
        </Text>
        <Text className="font-pbold text-[16px] text-green mt-2">{`RM ${dish.dish_price!.toFixed(
          2
        )}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DishCard;
