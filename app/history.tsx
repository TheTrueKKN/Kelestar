// History.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import { deleteMeal, getMealListingByCustomer } from "../controllers/mealController";
import { Meal } from "../interfaces/meal";
import { Dish } from "../interfaces/dish";
import {
  getCarbonRating,
} from "../lib/utils/carbonRating";
import { periodOptions } from "../enums/periodOptions";
import { RatingColor } from "../enums/carbonRating";

type DateComparisonFn = (date1: Date, date2: Date) => DateComparisonResult;
type DateComparisonResult = { isSamePeriod: boolean; period: string };

const getSameDate: DateComparisonFn = (date1, date2) => {
  const period = date1.toISOString().split("T")[0];
  const result: DateComparisonResult = { isSamePeriod: false, period };

  if (period === date2.toISOString().split("T")[0]) {
    result.isSamePeriod = true;
  }

  return result;
};

const getSameWeek: DateComparisonFn = (date1, date2) => {
  function getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(date);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    return startOfWeek;
  }

  const startOfWeek1 = getStartOfWeek(date1);
  const startOfWeek2 = getStartOfWeek(date2);

  const endOfWeek = new Date(startOfWeek1.getTime() + 6 * 24 * 60 * 60 * 1000);
  const period = `${startOfWeek1.toISOString().split("T")[0]} to ${
    endOfWeek.toISOString().split("T")[0]
  }`;
  const result: DateComparisonResult = { isSamePeriod: false, period };

  if (startOfWeek1.getTime() === startOfWeek2.getTime()) {
    result.isSamePeriod = true;
  }

  return result;
};

const getSameMonth: DateComparisonFn = (date1, date2) => {
  const period = `${date1.toLocaleString("default", {
    month: "long",
  })} ${date1.getFullYear()}`;
  const result: DateComparisonResult = { isSamePeriod: false, period };

  if (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  ) {
    result.isSamePeriod = true;
  }

  return result;
};

type PeriodData = {
  period: string;
  totalCarbon: number;
  meals: Meal[];
};

const generateMealData = (
  meals: Meal[],
  periodType: periodOptions
): Record<string, PeriodData> => {
  const data: Record<string, PeriodData> = {};

  let mealIndex = 0;
  const totalMeals = meals.length;

  while (mealIndex < totalMeals) {
    const mealsToday: Meal[] = [];
    const currentDate = meals[mealIndex].meal_datetime!;
    let totalCarbon = 0;

    const periodHandlers: Record<periodOptions, DateComparisonFn> = {
      [periodOptions.Day]: getSameDate,
      [periodOptions.Week]: getSameWeek,
      [periodOptions.Month]: getSameMonth,
    };

    const getSamePeriod = periodHandlers[periodType] || getSameDate;

    let samePeriod = getSamePeriod(
      meals[mealIndex].meal_datetime!,
      currentDate
    );
    let currentPeriod = samePeriod.period;

    do {
      mealsToday.push({
        id: meals[mealIndex].id,
        ...meals[mealIndex],
      });
      totalCarbon += meals[mealIndex].meal_dish?.dish_total_carbon ?? 0;

      mealIndex++;

      if (mealIndex < totalMeals) {
        samePeriod = getSamePeriod(meals[mealIndex].meal_datetime!, currentDate);
      } else {
        break;
      }
    } while (samePeriod.isSamePeriod);

    data[currentPeriod] = {
      period: currentPeriod,
      totalCarbon,
      meals: mealsToday,
    };
  }

  return data;
};

const History = () => {
  const [selectedOption, setSelectedOption] = useState(periodOptions.Day);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealData, setMealData] = useState<Record<string, PeriodData>>({});
  const [selectedMeal, setSelectedMeal] = useState<{id: string, dish: Dish} | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const initMeals = async () => {
        setLoading(true);
        const fetchedMeals = await getMealListingByCustomer();
        if (fetchedMeals) {
          setMeals(fetchedMeals);
        }
        setLoading(false);
      };

      initMeals();
    }, [])
  );

  useEffect(() => {
    setLoading(true);
    const data = generateMealData(meals, selectedOption);
    setMealData(data);
    setLoading(false);
  }, [meals, selectedOption]);

  // Action handlers
  const onPressMeal = (mealId: string, dish: Dish) => {
    setSelectedMeal({id: mealId, dish});
    setActionModalVisible(true);
  };

  const closeActionModal = () => {
    setActionModalVisible(false);
    setSelectedMeal(null);
  };

  const handleView = () => {
    if (!selectedMeal) return;
    closeActionModal();
    router.push({
      pathname: "/tracking",
      params: {
        dish: JSON.stringify(selectedMeal.dish),
      },
    });
  };

  const promptDelete = () => {
    setActionModalVisible(false);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedMeal) {
      const success = await deleteMeal({id: selectedMeal.id});
      if (success) {
        setMeals(meals.filter(meal => meal.id !== selectedMeal.id));
      }
    }
    setConfirmDeleteVisible(false);
    setSelectedMeal(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteVisible(false);
    setSelectedMeal(null);
  };

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
              setSelectedOption(itemValue);
              setShowPicker(false);
            }}
            style={{ height: 150, width: 150 }}
          >
            {Object.values(periodOptions).map((option) => (
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
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
        style={{ height: 60, width: 140 }}
        dropdownIconColor="#000000"
      >
        {Object.values(periodOptions).map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );

  // Render each dish item
  const renderFoodItem = (mealId: string, dish: Dish) => {
    const carbonRating = getCarbonRating(dish.dish_total_carbon ?? 0);
    const bgColor = RatingColor[carbonRating];

    return (
      <TouchableOpacity
        key={mealId}
        className="mx-4 my-1 rounded-lg overflow-hidden bg-[#F2F2F2]"
        onPress={() => onPressMeal(mealId, dish)}
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
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Text style={{ textAlign: "center", marginTop: 32 }}>
        Loading history...
      </Text>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 pt-4">
        {Platform.OS === "ios" ? renderIOSPicker() : renderAndroidPicker()}
      </View>
      <ScrollView
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {Object.keys(mealData).map((period) => (
          <View key={period}>
            <View className="flex-row justify-between px-4 mb-2">
              <Text className="text-lg font-semibold">{period}</Text>
            </View>
            {mealData[period].meals.map((meal) =>
              renderFoodItem(meal.id!, meal.meal_dish!)
            )}
            <View className="px-4 mt-2 mb-6 items-end">
              <Text className="text-gray-500 font-normal">
                Total: {mealData[period].totalCarbon.toFixed(2)} kg CO₂e
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Action Sheet Modal */}
      <Modal transparent animationType="slide" visible={actionModalVisible} onRequestClose={closeActionModal}>
        <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={closeActionModal} />
        <View className="bg-white p-4 rounded-t-2xl border-t border-gray-200">
          <View className="mb-4 items-center">
            <Text className="text-lg font-medium text-gray-800">{selectedMeal?.dish.dish_name}</Text>
          </View>
          <TouchableOpacity className="py-3 border-t border-gray-100" onPress={handleView}>
            <Text className="text-base text-gray-700">View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-3 border-t border-gray-100" onPress={promptDelete}>
            <Text className="text-base text-red-600">Delete Record</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-3 mt-2" onPress={closeActionModal}>
            <Text className="text-base text-gray-500 text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal transparent animationType="fade" visible={confirmDeleteVisible} onRequestClose={cancelDelete}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-4">
            <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
              Confirm Deletion
            </Text>
            <View className="h-px bg-gray-200 my-2" />
            <Text className="text-base text-gray-600 mb-6 text-center">
              Are you sure you want to permanently delete 
              {'\n'}"{selectedMeal?.dish.dish_name}" from your history?
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={cancelDelete}
                className="flex-1 bg-gray-100 rounded-lg py-2"
              >
                <Text className="text-center text-gray-800 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                className="flex-1 bg-red-600 rounded-lg py-2"
              >
                <Text className="text-center text-white font-medium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default History;
