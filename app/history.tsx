// History.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  interpolate,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useFocusEffect } from "expo-router";
import { getMealListingByCustomer } from "../controllers/mealController";
import { Meal } from "../interfaces/meal";
import { Dish } from "../interfaces/dish";
import {
  getCarbonRating,
  getRatingBadgeColor,
} from "../lib/utils/carbonRating";

interface SwipeableItemProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * SwipeableItem Component using Tailwind classes for static styling
 * and inline animated style for dynamic opacity.
 */
const SwipeableItem = ({ children, onEdit, onDelete }: SwipeableItemProps) => {
  // Adjust swipe parameters so you don't have to swipe too far.
  const maxTranslate = -100;
  const threshold = -40;
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      // Allow only leftward swipe (negative translation)
      translateX.value = Math.min(0, ctx.startX + event.translationX);
    },
    onEnd: () => {
      // Snap open if past threshold; else, close.
      if (translateX.value < threshold) {
        translateX.value = withSpring(maxTranslate);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  // Animated style for the card moving left.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Animated opacity for the buttons.
  const animatedOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, maxTranslate],
      [0, 1],
      "clamp"
    );
    return { opacity };
  });

  return (
    <View className="mx-4 my-1 rounded-lg overflow-hidden relative">
      {/* Underlay buttons container positioned to the right */}
      <View className="absolute inset-y-0 right-0 flex-row items-center pr-2">
        {/* Use Tailwind classes for width, height, and margin; merge in animated opacity */}
        <Animated.View style={animatedOpacity} className="w-12 h-full">
          <TouchableOpacity
            onPress={onEdit}
            className="w-12 h-full justify-center items-center bg-green-500 rounded-l-lg"
          >
            <Text className="text-white font-bold">Edit</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={animatedOpacity} className="w-10 h-full">
          <TouchableOpacity
            onPress={onDelete}
            className="w-12 h-full justify-center items-center bg-red-500 rounded-r-lg"
          >
            <Text className="text-white font-bold">Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {/* Swipeable card */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={animatedStyle} className="bg-[#F2F2F2]">
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.toISOString().split("T")[0] === date2.toISOString().split("T")[0]
  );
}

type DayData = {
  date: Date;
  totalCarbon: number;
  meals: Meal[];
};

const generateMealData = (meals: Meal[]): Record<string, DayData> => {
  const data: Record<string, DayData> = {};

  let mealIndex = 0;
  const totalMeals = meals.length;
  let currentDate = new Date();

  // Generate data for the current month
  while (mealIndex < totalMeals) {
    const mealsToday: Meal[] = [];
    currentDate = meals[mealIndex].meal_datetime!;
    let totalCarbon = 0;

    while (
      mealIndex < totalMeals &&
      isSameDate(meals[mealIndex].meal_datetime!, currentDate)
    ) {
      mealsToday.push({
        id: meals[mealIndex].id,
        ...meals[mealIndex],
      });
      totalCarbon += meals[mealIndex].meal_dish?.dish_total_carbon ?? 0;

      mealIndex++;
    }

    const dateKey = currentDate.toISOString().split("T")[0];
    data[dateKey] = {
      date: currentDate,
      totalCarbon,
      meals: mealsToday,
    };
  }

  return data;
};

const History = () => {
  const [selectedOption, setSelectedOption] = useState("Month");
  const [isAscending, setIsAscending] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const timeOptions = ["Week", "Month", "Year"];
  const [meals, setMeals] = useState<Meal[]>([]);
  const mealData = useMemo(() => generateMealData(meals), [meals]);

  useFocusEffect(
    React.useCallback(() => {
      const initMeals = async () => {
        const fetchedMeals = await getMealListingByCustomer();
        if (fetchedMeals) {
          setMeals(fetchedMeals);
          const mealTemp = generateMealData(fetchedMeals);
        }
      };
      initMeals();
    }, [])
  );

  // Sample dish data.
  // const [todayDishes] = useState<Dish[]>([
  //   {
  //     id: "1",
  //     name: "Tofu Buddha Bowl",
  //     image: require("../assets/images/tofu_bowl_pic.png"),
  //     price: "RM 12",
  //     grade: "A",
  //     gradeColor: "#8DC63F",
  //   },
  //   {
  //     id: "2",
  //     name: "Chicken Rice",
  //     image: require("../assets/images/chicken_rice.png"),
  //     price: "RM 10",
  //     grade: "B",
  //     gradeColor: "#F8D15B",
  //   },
  //   {
  //     id: "3",
  //     name: "Beef Sharwama set",
  //     image: require("../assets/images/beef_shawarma_set.png"),
  //     price: "RM 18",
  //     grade: "C",
  //     gradeColor: "#ED1C24",
  //   },
  // ]);

  // const [yesterdayDishes] = useState<Dish[]>([
  //   {
  //     id: "4",
  //     name: "Tofu Buddha Bowl",
  //     image: require("../assets/images/tofu_bowl_pic.png"),
  //     price: "RM 12",
  //     grade: "A",
  //     gradeColor: "#8DC63F",
  //   },
  //   {
  //     id: "5",
  //     name: "Chicken Rice",
  //     image: require("../assets/images/chicken_rice.png"),
  //     price: "RM 10",
  //     grade: "B",
  //     gradeColor: "#F8D15B",
  //   },
  // ]);

  const toggleSortOrder = useCallback(() => {
    setIsAscending((prev) => !prev);
  }, []);

  // Date formatting helper.
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const formatDate = (date: Date) =>
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  const todayDate = formatDate(today);
  const yesterdayDate = formatDate(yesterday);

  // Action handlers.
  const handleEdit = (meal: Meal) => {
    Alert.alert("Edit", `Edit ${meal.meal_dish?.dish_name}`);
  };

  const handleDelete = (meal: Meal) => {
    Alert.alert("Delete", `Delete ${meal.meal_dish?.dish_name}`);
  };

  // Render each dish item with swipe functionality.
  const renderFoodItem = useCallback((meal_id: string, dish: Dish) => {
    const carbonRating = getCarbonRating(dish.dish_total_carbon ?? 0);
    const bgColor = getRatingBadgeColor(carbonRating);

    return (
      <SwipeableItem
        key={meal_id}
        onEdit={() => handleEdit(dish)}
        onDelete={() => handleDelete(dish)}
      >
        <View className="flex-row items-center justify-between p-3">
          <View className="flex-row items-center">
            <Image
              source={{ uri: dish.dish_image_url }}
              className="w-12 h-12 rounded-full"
              resizeMode="cover"
            />
            <View className="ml-3">
              <Text className="font-semibold text-base text-black">
                {dish.dish_name}
              </Text>
              <Text className="font-normal text-gray-500">{`RM ${dish.dish_price?.toFixed(
                2
              )}`}</Text>
            </View>
          </View>
          <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: bgColor }}
          >
            <Text className="text-white font-bold">{carbonRating}</Text>
          </View>
        </View>
      </SwipeableItem>
    );
  }, []);

  const renderIOSPicker = () => (
    <View className="z-20">
      <TouchableOpacity
        onPress={() => setShowPicker(!showPicker)}
        className="flex-row items-center"
      >
        <Text className="text-base text-gray-800 mr-1 font-normal">
          {selectedOption}
        </Text>
        <Image
          source={require("../assets/icons/chevron-down.png")}
          className="w-4 h-4"
          resizeMode="contain"
        />
      </TouchableOpacity>
      {showPicker && (
        <View className="absolute top-8 left-0 z-30 bg-white border border-gray-200 rounded-md shadow-md">
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => {
              setSelectedOption(itemValue.toString());
              setShowPicker(false);
            }}
            style={{ height: 150, width: 150 }}
          >
            {timeOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );

  const renderAndroidPicker = () => (
    <View className="ml-[-10px]">
      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue.toString())}
        style={{ height: 50, width: 120 }}
        dropdownIconColor="#000000"
      >
        {timeOptions.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 pt-4">
        {Platform.OS === "ios" ? renderIOSPicker() : renderAndroidPicker()}
        <TouchableOpacity onPress={toggleSortOrder}>
          <Image
            source={require("../assets/icons/triple_line_icon.png")}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Today's Section */}
        {/* <View>
          <View className="flex-row justify-between px-4 mb-2">
            <Text className="text-lg font-semibold">Today</Text>
            <Text className="text-gray-500 font-normal">{todayDate}</Text>
          </View>
          {todayDishes.map(renderFoodItem)}
          <View className="px-4 mt-2 mb-6 items-end">
            <Text className="text-gray-500 font-normal">
              Total: 7.8 Kg CO₂e
            </Text>
          </View>
        </View> */}
        {/* Yesterday's Section */}
        {/* <View>
          <View className="flex-row justify-between px-4 mb-2">
            <Text className="text-lg font-semibold">Yesterday</Text>
            <Text className="text-gray-500 font-normal">{yesterdayDate}</Text>
          </View>
          {yesterdayDishes.map(renderFoodItem)}
        </View> */}
        {Object.keys(mealData).map((date) => (
          <View key={date}>
            <View className="flex-row justify-between px-4 mb-2">
              <Text className="text-lg font-semibold">{date}</Text>
              {/* <Text className="text-gray-500 font-normal">{todayDate}</Text> */}
            </View>
            {mealData[date].meals.map((meal) =>
              renderFoodItem(meal.id!, meal.meal_dish!)
            )}
            <View className="px-4 mt-2 mb-6 items-end">
              <Text className="text-gray-500 font-normal">
                Total: {mealData[date].totalCarbon.toFixed(2)} Kg CO₂e
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
