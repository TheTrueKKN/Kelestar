import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  BarChart2,
  X as CloseIcon
} from "lucide-react-native";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
import { getMealListingByCustomer } from "../../controllers/mealController";
import { getCustomerByUser } from "../../controllers/customerController";
import { Meal } from "../../interfaces/meal";
import { Dish } from "../../interfaces/dish";
import { useFocusEffect } from "expo-router";
import { getCarbonRating} from "../../lib/utils/carbonRating";
import { CarbonRating, RatingColor } from "../../enums/carbonRating";

// Types
// type Meal = {
//   id: string;
//   name: string;
//   carbon: number;
//   rating: "A" | "B" | "C" | "D";
// };

type DayData = {
  date: Date;
  totalCarbon: number;
  meals: Meal[];
};

function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.toISOString().split("T")[0] === date2.toISOString().split("T")[0]
  );
}

const generateMealData = (meals: Meal[]): Record<string, DayData> => {
  const data: Record<string, DayData> = {};

  let mealIndex = 0;
  const totalMeals = meals.length;

  // Generate data for the current month
  while (mealIndex < totalMeals) {
    // if (mealIndex >= totalMeals) {
    //   break;
    // }

    const date = meals[mealIndex].meal_datetime!;
    // date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    const mealsToday: Meal[] = [];
    let totalCarbon = 0;

    do  {
      mealsToday.push({
        id: meals[mealIndex].id,
        ...meals[mealIndex],
      });
      totalCarbon += meals[mealIndex].meal_dish?.dish_total_carbon ?? 0;

      mealIndex++;
    } while (
      mealIndex < totalMeals &&
      isSameDate(meals[mealIndex].meal_datetime!, date)
    )

    data[dateKey] = {
      date,
      totalCarbon,
      meals: mealsToday,
    };
  }

  return data;
};

export default function Statistics() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [carbonBudget, setCarbonBudget] = useState(7.5);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDishDetails, setSelectedDishDetails] = useState<Dish | null>(null);
  const [dishDetailsVisible, setDishDetailsVisible] = useState(false);
  const mealData = useMemo(() => generateMealData(meals), [meals]);
  // const [mealData, setMealData] = useState<Record<string, DayData>>({});

  useFocusEffect(
    React.useCallback(() => {
      const initCarbonBudget = async () => {
        const retrievedCustomer = await getCustomerByUser();
        if (retrievedCustomer && retrievedCustomer.customer_carbon_budget) {
          setCarbonBudget(retrievedCustomer.customer_carbon_budget);
        }
      };
      initCarbonBudget();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const initMeals = async () => {
        const fetchedMeals = await getMealListingByCustomer();
        if (fetchedMeals) {
          setMeals(fetchedMeals);
          // setMealData(generateMealData(fetchedMeals));
        }
      };
      initMeals();
    }, [])
  );

  // Format date to YYYY-MM-DD for lookup
  const selectedDateKey = selectedDate.toISOString().split("T")[0];
  const selectedDayData = mealData[selectedDateKey] || {
    totalCarbon: 0,
    meals: [],
  };

  // Get start and end of week for current view
  const getWeekDates = () => {
    const startDate = new Date(currentDate);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startDate.setDate(diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  // Handle week navigation
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    const daysToAdd = direction === "next" ? 7 : -7;
    newDate.setDate(newDate.getDate() + daysToAdd);
    setCurrentDate(newDate);
  };

  // Get weekly data for the graph
  const weeklyData = useMemo(() => {
    return weekDates.map((date) => {
      const dateKey = date.toISOString().split("T")[0];
      return mealData[dateKey]?.totalCarbon || 0;
    });
  }, [weekDates, mealData]);

  // Chart dimensions
  const chartWidth = 300;
  const chartHeight = 100;
  const chartPadding = 10;
  const xAxisHeight = 20;
  const totalHeight = chartHeight + xAxisHeight;

  // Generate SVG path for the curve
  const generateCurvePath = () => {
    if (weeklyData.length === 0) return "";

    const maxValue = Math.max(...weeklyData, 1); // Prevent division by zero

    // Calculate points
    const points = weeklyData.map((value, index) => {
      const x =
        chartPadding +
        index * ((chartWidth - chartPadding * 2) / (weeklyData.length - 1));
      const y =
        chartHeight -
        chartPadding -
        (value / maxValue) * (chartHeight - chartPadding * 2);
      return { x, y };
    });

    // Create SVG path
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const controlPointX1 = (points[i].x + points[i + 1].x) / 2;
      const controlPointY1 = points[i].y;
      const controlPointX2 = (points[i].x + points[i + 1].x) / 2;
      const controlPointY2 = points[i + 1].y;

      path += ` C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${
        points[i + 1].x
      } ${points[i + 1].y}`;
    }

    return path;
  };

  // Get max value index for highlighted dot
  const getMaxValueIndex = () => {
    if (weeklyData.length === 0) return 0;
    return weeklyData.indexOf(Math.max(...weeklyData));
  };

  // Calculate the x position for each day label
  const getDayXPosition = (index: number) => {
    return (
      chartPadding +
      index * ((chartWidth - chartPadding * 2) / (weeklyData.length - 1))
    );
  };

  // Get day abbreviation (M, T, W, etc.)
  const getDayAbbreviation = (date: Date) => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    return days[date.getDay()];
  };

  // Calculate budget percentage
  const budgetPercentage = Math.min(
    (selectedDayData.totalCarbon / carbonBudget) * 100,
    100
  );
  // Get grade for the day and its color
  const dayGrade = getCarbonRating(selectedDayData.totalCarbon);
  const gradeColor = RatingColor[dayGrade];



  // Render rating badge
  const renderRatingBadge = (rating: CarbonRating) => {
    const bgColor = RatingColor[rating];

    return (
      <View
        className={`w-8 h-8 rounded-full justify-center items-center`}
        style={{ backgroundColor: bgColor }}
      >
        <Text className="text-white font-bold">{rating}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-6 pb-6">
          <View className="flex-row justify-between items-center">
            <Text className="h-[42px] font-psemibold text-[28px] leading-[42px] text-[#1E1F1F]">
              My Meal Footprint
            </Text>
          </View>

          {/* Date selector */}
          <View className="flex-row justify-between items-center mt-6">
            <View className="flex-row space-x-4 items-center">
              <TouchableOpacity onPress={() => navigateWeek("prev")}>
                <ChevronLeft size={24} color="#666" />
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-3">
                  {weekDates.map((date) => {
                    const day = ["M", "T", "W", "T", "F", "S", "S"][
                      date.getDay() === 0 ? 6 : date.getDay() - 1
                    ];
                    const dateNum = date.getDate();
                    const isSelected =
                      date.toDateString() === selectedDate.toDateString();

                    return (
                      <View key={date.toISOString()} className="items-center">
                        <Text className="text-gray-400 mb-1">{day}</Text>
                        <TouchableOpacity
                          className={`w-8 h-8 rounded-full justify-center items-center ${
                            isSelected ? "bg-green-500" : "bg-transparent"
                          }`}
                          onPress={() => setSelectedDate(date)}
                        >
                          <Text
                            className={
                              isSelected
                                ? "text-white font-semibold"
                                : "text-gray-600 font-semibold"
                            }
                          >
                            {dateNum}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>

              <TouchableOpacity onPress={() => navigateWeek("next")}>
                <ChevronRight size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Carbon budget */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600">Daily Carbon budget</Text>
            <Text className="text-gray-600 font-semibold">
              {selectedDayData.totalCarbon.toFixed(1)}/{carbonBudget}g CO₂e
            </Text>
          </View>

        <View className="h-6 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{ width: `${budgetPercentage}%`, backgroundColor: gradeColor }}
          />
        </View>
        </View>

        {/* Meals */}
        <View className="px-4 mb-6">
          <Text className="text-gray-600 mb-3">
            Here's what you have eaten on {selectedDate.toLocaleDateString()}
          </Text>

          {selectedDayData.meals.length > 0 ? (
            selectedDayData.meals.map((meal) => (
              <View
                key={meal.id}
                className="bg-gray-100 rounded-xl p-4 flex-row justify-between items-center mb-3"
              >
                <TouchableOpacity 
                  className="flex-1 flex-row justify-between items-center"
                  onPress={() => {
                    setSelectedDishDetails(meal.meal_dish || null);
                    setDishDetailsVisible(true);
                  }}
                >
                  <View>
                    <Text className="font-semibold text-base">
                      {meal.meal_dish?.dish_name}
                    </Text>
                    <Text className="text-gray-500">
                      {meal.meal_dish?.dish_total_carbon?.toFixed(1)}g CO₂e
                    </Text>
                  </View>
                  {renderRatingBadge(
                    getCarbonRating(meal.meal_dish?.dish_total_carbon ?? 0)
                  )}
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="bg-gray-100 rounded-xl p-4 mb-3">
              <Text className="text-gray-500">
                No meals recorded for this day
              </Text>
            </View>
          )}

          {selectedDayData.totalCarbon > 0 && (
            <View className="mt-2">
              <Text className="text-gray-600">
                In total{" "}
                <Text className="font-semibold">
                  {selectedDayData.totalCarbon.toFixed(1)}g CO₂e
                </Text>{" "}
                is equivalent to...
              </Text>
            </View>
          )}
        </View>

        {/* Equivalent - Only show if there are meals */}
        {selectedDayData.totalCarbon > 0 && (
          <View className="px-4 mb-6">
            <View className="flex-row items-center">
              <View className="mr-4">
                <Svg width={80} height={65} viewBox="0 0 100 70">
                  <Path
                    d="M10,45 L20,45 C25,45 25,30 30,30 L70,30 C75,30 75,45 80,45 L90,45 L90,55 L10,55 Z"
                    fill="#FF9D42"
                    stroke="#444"
                    strokeWidth={1}
                  />
                  <Circle cx={30} cy={55} r={10} fill="#aaa" stroke="#444" />
                  <Circle cx={70} cy={55} r={10} fill="#aaa" stroke="#444" />
                  <Circle cx={30} cy={55} r={5} fill="#fff" />
                  <Circle cx={70} cy={55} r={5} fill="#fff" />
                </Svg>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700">
                  Driving {Math.round(selectedDayData.totalCarbon * 2.7)} miles
                  in{"\n"}
                  an average car
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Weekly footprint */}
        <View className="px-4 mb-20">
          <Text className="text-gray-600 font-semibold text-lg mb-4">
            Weekly footprint
          </Text>

          <View className="h-36 w-full">
            <Svg
              height="100%"
              width="100%"
              viewBox={`0 0 ${chartWidth} ${totalHeight}`}
            >
              {/* Main curve */}
              <Path
                d={generateCurvePath()}
                fill="none"
                stroke="#7CD026"
                strokeWidth={3}
              />

              {/* Highlight point */}
              {weeklyData.length > 0 && (
                <Circle
                  cx={getDayXPosition(getMaxValueIndex())}
                  cy={
                    chartHeight -
                    chartPadding -
                    (weeklyData[getMaxValueIndex()] /
                      Math.max(...weeklyData, 1)) *
                      (chartHeight - chartPadding * 2)
                  }
                  r={5}
                  fill="#7332ff"
                />
              )}

              {/* X-Axis line */}
              <Line
                x1={chartPadding}
                y1={chartHeight}
                x2={chartWidth - chartPadding}
                y2={chartHeight}
                stroke="#DDDDDD"
                strokeWidth={1}
              />

              {/* X-Axis day markers and labels */}
              {weekDates.map((date, index) => (
                <React.Fragment key={date.toISOString()}>
                  <Line
                    x1={getDayXPosition(index)}
                    y1={chartHeight}
                    x2={getDayXPosition(index)}
                    y2={chartHeight + 5}
                    stroke="#AAAAAA"
                    strokeWidth={1}
                  />
                  <SvgText
                    x={getDayXPosition(index)}
                    y={chartHeight + 18}
                    fontSize={10}
                    textAnchor="middle"
                    fill="#666666"
                  >
                    {getDayAbbreviation(date)}
                  </SvgText>
                </React.Fragment>
              ))}
            </Svg>
          </View>
        </View>
      </ScrollView>

      {/* Dish Details Modal */}
      <Modal
        visible={dishDetailsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDishDetailsVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-5">
          <View className="bg-white w-full rounded-2xl p-5 shadow-xl">
            {/* Header with close button */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-pbold text-primary">{selectedDishDetails?.dish_name}</Text>
              <TouchableOpacity 
                onPress={() => setDishDetailsVisible(false)}
                className="p-1 rounded-full bg-gray-100"
              >
                <CloseIcon size={18} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Dish Image */}
            {selectedDishDetails?.dish_image_url && (
              <Image
                source={{ uri: selectedDishDetails.dish_image_url }}
                className="h-32 w-full rounded-lg mb-4"
                resizeMode="cover"
              />
            )}

            {/* Rating Badge and Carbon */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-medium">
                Carbon: <Text className="text-primary font-bold">{selectedDishDetails?.dish_total_carbon?.toFixed(2)} kg CO₂e</Text>
              </Text>
              {selectedDishDetails && (
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: RatingColor[getCarbonRating(selectedDishDetails.dish_total_carbon ?? 0)] }}
                >
                  <Text className="text-white font-pbold text-lg">
                    {getCarbonRating(selectedDishDetails.dish_total_carbon ?? 0)}
                  </Text>
                </View>
              )}
            </View>

            {/* Ingredients Section */}
            <View className="mb-4">
              <Text className="text-base font-pbold text-gray-700 mb-2">Ingredients:</Text>
              {selectedDishDetails?.dish_ingredient?.length ? (
                <ScrollView style={{ maxHeight: 120 }} className="border-t border-b border-gray-200 py-2">
                  {selectedDishDetails.dish_ingredient.map((ing, idx) => (
                    <View key={ing.ingredient.id || idx} className="flex-row justify-between py-1">
                      <Text className="text-gray-700">{ing.ingredient.ingredient_name}</Text>
                      <Text className="text-gray-500">{ing.ingredient_amount}g</Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text className="text-gray-500 italic">No ingredient information available</Text>
              )}
            </View>

            {/* Price */}
            <Text className="text-base font-semibold text-green-600">
              Price: RM {selectedDishDetails?.dish_price?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Bottom navigation indicator only */}
      <View className="h-12 bg-gray-100 border-t border-gray-200">
        <View className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
          <View className="w-12 h-12 rounded-full bg-white shadow-md justify-center items-center">
            <View className="w-10 h-10 rounded-full bg-green-500 justify-center items-center">
              <BarChart2 size={24} color="white" />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
