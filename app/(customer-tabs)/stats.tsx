import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Share2, BarChart2 } from 'lucide-react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

// Types
type Meal = {
  id: string;
  name: string;
  carbon: number;
  rating: 'A' | 'B' | 'C' | 'D';
};

type DayData = {
  date: Date;
  totalCarbon: number;
  meals: Meal[];
};

// Sample data
const generateSampleData = (): Record<string, DayData> => {
  const today = new Date();
  const data: Record<string, DayData> = {};
  
  // Generate data for the current month
  for (let i = 1; i <= 28; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    const dateKey = date.toISOString().split('T')[0];
    
    // Generate random meals
    const numMeals = Math.floor(Math.random() * 3) + 1;
    const meals: Meal[] = [];
    let totalCarbon = 0;
    
    const mealOptions = [
      { name: 'Tofu Buddha Bowl', carbon: 1.4, rating: 'A' as const },
      { name: 'Chicken Rice', carbon: 2.9, rating: 'B' as const },
      { name: 'Beef Burger', carbon: 5.8, rating: 'C' as const },
      { name: 'Vegetable Pasta', carbon: 1.8, rating: 'A' as const },
      { name: 'Fish and Chips', carbon: 3.5, rating: 'B' as const },
      { name: 'Quinoa Salad', carbon: 1.2, rating: 'A' as const },
    ];
    
    for (let j = 0; j < numMeals; j++) {
      const meal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
      meals.push({
        id: `meal-${i}-${j}`,
        ...meal
      });
      totalCarbon += meal.carbon;
    }
    
    data[dateKey] = {
      date,
      totalCarbon,
      meals
    };
  }
  
  return data;
};

export default function Statistics() {
  const mealData = useMemo(() => generateSampleData(), []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dailyBudget = 7.5; // Daily carbon budget in kg CO2e
  
  // Format date to YYYY-MM-DD for lookup
  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const selectedDayData = mealData[selectedDateKey] || { totalCarbon: 0, meals: [] };
  
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
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const daysToAdd = direction === 'next' ? 7 : -7;
    newDate.setDate(newDate.getDate() + daysToAdd);
    setCurrentDate(newDate);
  };
  
  // Get weekly data for the graph
  const weeklyData = useMemo(() => {
    return weekDates.map(date => {
      const dateKey = date.toISOString().split('T')[0];
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
      const x = chartPadding + (index * ((chartWidth - (chartPadding * 2)) / (weeklyData.length - 1)));
      const y = chartHeight - chartPadding - ((value / maxValue) * (chartHeight - (chartPadding * 2)));
      return { x, y };
    });
    
    // Create SVG path
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const controlPointX1 = (points[i].x + points[i + 1].x) / 2;
      const controlPointY1 = points[i].y;
      const controlPointX2 = (points[i].x + points[i + 1].x) / 2;
      const controlPointY2 = points[i + 1].y;
      
      path += ` C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${points[i + 1].x} ${points[i + 1].y}`;
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
    return chartPadding + (index * ((chartWidth - (chartPadding * 2)) / (weeklyData.length - 1)));
  };

  // Get day abbreviation (M, T, W, etc.)
  const getDayAbbreviation = (date: Date) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[date.getDay()];
  };

  // Calculate budget percentage
  const budgetPercentage = Math.min((selectedDayData.totalCarbon / dailyBudget) * 100, 100);

  // Get rating badge color
  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-yellow-400';
      case 'C': return 'bg-orange-500';
      case 'D': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Render rating badge
  const renderRatingBadge = (rating: string) => {
    const bgColor = getRatingBadgeColor(rating);
    
    return (
      <View className={`${bgColor} w-8 h-8 rounded-full justify-center items-center`}>
        <Text className="text-white font-bold">{rating}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-2 pb-6">
          <View className="flex-row justify-between items-center">
            <Text className="h-[42px] font-psemibold text-[28px] leading-[42px] text-[#1E1F1F]">My Meal Footprint</Text>
            <TouchableOpacity>
              <Share2 size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Date selector */}
          <View className="flex-row justify-between items-center mt-6">
            <View className="flex-row space-x-4 items-center">
              <TouchableOpacity onPress={() => navigateWeek('prev')}>
                <ChevronLeft size={24} color="#666" />
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-3">
                  {weekDates.map((date) => {
                    const day = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][date.getDay() === 0 ? 6 : date.getDay() - 1];
                    const dateNum = date.getDate();
                    const isSelected = date.toDateString() === selectedDate.toDateString();

                    return (
                      <View key={date.toISOString()} className="items-center">
                        <Text className="text-gray-400 mb-1">{day}</Text>
                        <TouchableOpacity
                          className={`w-8 h-8 rounded-full justify-center items-center ${
                            isSelected ? 'bg-green-500' : 'bg-transparent'
                          }`}
                          onPress={() => setSelectedDate(date)}
                        >
                          <Text
                            className={isSelected ? 'text-white font-semibold' : 'text-gray-600 font-semibold'}
                          >
                            {dateNum}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>

              <TouchableOpacity onPress={() => navigateWeek('next')}>
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
              {selectedDayData.totalCarbon.toFixed(1)}/{dailyBudget} kg CO₂e
            </Text>
          </View>
          
          <View className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <View 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${budgetPercentage}%` }} 
            />
          </View>
        </View>
        
        {/* Meals */}
        <View className="px-4 mb-6">
          <Text className="text-gray-600 mb-3">Here's what you have eaten today...</Text>
          
          {selectedDayData.meals.length > 0 ? (
            selectedDayData.meals.map((meal) => (
              <View key={meal.id} className="bg-gray-100 rounded-xl p-4 flex-row justify-between items-center mb-3">
                <View>
                  <Text className="font-semibold text-base">{meal.name}</Text>
                  <Text className="text-gray-500">{meal.carbon.toFixed(1)}kg CO₂e</Text>
                </View>
                {renderRatingBadge(meal.rating)}
              </View>
            ))
          ) : (
            <View className="bg-gray-100 rounded-xl p-4 mb-3">
              <Text className="text-gray-500">No meals recorded for this day</Text>
            </View>
          )}
          
          {selectedDayData.totalCarbon > 0 && (
            <View className="mt-2">
              <Text className="text-gray-600">
                In total <Text className="font-semibold">{selectedDayData.totalCarbon.toFixed(1)}kg CO₂e</Text> is equivalent to...
              </Text>
            </View>
          )}
        </View>
        
        {/* Equivalent - Only show if there are meals */}
        {selectedDayData.totalCarbon > 0 && (
          <View className="px-4 mb-6">
            <View className="flex-row items-center">
              <View className="mr-4">
                <Svg width={80} height={50} viewBox="0 0 100 60">
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
                  Driving {Math.round(selectedDayData.totalCarbon * 2.7)} miles in{'\n'}
                  an average car
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Weekly footprint */}
        <View className="px-4 mb-20">
          <Text className="text-gray-600 font-semibold text-lg mb-4">Weekly footprint</Text>
          
          <View className="h-36 w-full">
            <Svg height="100%" width="100%" viewBox={`0 0 ${chartWidth} ${totalHeight}`}>
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
                  cy={chartHeight - chartPadding - ((weeklyData[getMaxValueIndex()] / Math.max(...weeklyData, 1)) * (chartHeight - (chartPadding * 2)))}
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