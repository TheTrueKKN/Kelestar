import React, { useState, useEffect }from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IngredientSelector from "../components/IngredientSelector";
import { DishIngredient } from "../interfaces/dishIngredient";
import DishIngredientItem from "../components/DishIngredientItem";
import CalculateTotalCarbon from "../components/CalculateTotalCarbon";
import { useRouter } from "expo-router";

export default function Calculator() {

   const [showIngredientSelector, setShowIngredientSelector] = useState(false);
   const [ingredientList, setIngredientList] = useState<DishIngredient[]>([]);
   const [totalCarbon, setTotalCarbon] = useState(0);
   const [showExplanationModal, setShowExplanationModal] = useState(false);

   // Changing the Carbon grade and color
   const [grade, setGrade] = useState("A");
   const [gradeColor, setGradeColor] = useState("#74B318");

   const router = useRouter();

   const handleAddIngredient = (dishIngredient: DishIngredient) => {
       // Check if ingredient already exists in the list
       const alreadyExists = ingredientList.some(
         item => item.ingredient_id === dishIngredient.ingredient_id
       );
     
       if (alreadyExists) {
         // Show warning that ingredient is already added
         Alert.alert(
           "Ingredient Exists",
           "This ingredient has already been added to your dish.",
           [{ text: "OK" }]
         );
         return;
       }
     
       // If not exists, add to list
       setIngredientList(prev => [...prev, dishIngredient]);
       //console.log(`Current ing list: ${JSON.stringify([...ingredientList, dishIngredient], null, 2)}`);
     };

    const removeIngredient = async (ingredientId: string) => {
      setIngredientList((ingredientList) => ingredientList.filter(allIngredient => allIngredient.ingredient_id !== ingredientId))
    };

    useEffect(() => {
  const getCarbonGrade = (carbon: number): string => {
    if (carbon < 1) return "A";
    if (carbon >= 1 && carbon < 5) return "B";
    if (carbon >= 5 && carbon < 20) return "C";
    return "D";
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case "A": return "#74B318"; // green
      case "B": return "#A4D056"; // light green
      case "C": return "#FFDA44"; // yellow
      case "D": return "#F87171"; // red
      default: return "#CCCCCC";
    }
  };
  
  const newGrade = getCarbonGrade(totalCarbon);
  setGrade(newGrade);
  setGradeColor(getGradeColor(newGrade));
}, [totalCarbon]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 } } nestedScrollEnabled={true}>
        <View className="flex-1 bg-white">
          {/* Header with subtle shadow */}
          <View className="px-6 pt-12 pb-6 bg-white shadow-sm">
            <View className="flex-row items-center mb-3">
              <TouchableOpacity onPress={() => router.back()}  className="mr-3">
                <Ionicons name="chevron-back" size={24} color="#006400" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-[#006400]">
                Footprint Calculator
              </Text>
            </View>
            <Text className="text-base text-[#74B318] mt-1">
              Calculate your dish's environmental impact
            </Text>
          </View>

          {/* Form Content */}
          <View className="px-6 py-6">
            {/* Ingredients Section */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-[#006400] mb-3">INGREDIENTS</Text>

              {/* Add ingredient button */}
              <TouchableOpacity
                className="h-10 bg-[#74B318] rounded-md justify-center items-center mb-6"
                onPress={() => {
                  // Add functionality for adding ingredients
                  setShowIngredientSelector(true);
                  console.log("Add ingredients button pressed");
                }}
              >
                <Text className="text-white text-base font-bold">
                    + Add ingredients
                </Text>
              </TouchableOpacity>

              <Text className="text-base text-[#006400] mb-2">
                  Ingredient List:
              </Text>

              <ScrollView className="h-60" showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                  {ingredientList.length === 0 ? (
                    <Text className="text-gray-400 text-center mt-4">No ingredients added yet.</Text>
                  ) : 
                  (
                    ingredientList.map((dishIngredient) => (
                    <DishIngredientItem
                    key={dishIngredient.ingredient_id}
                    dishIngredient={dishIngredient}
                    onDelete={() => removeIngredient(dishIngredient.ingredient_id!)} 

                    />
                    ))
                  )
                }
              </ScrollView>

              {/* Ingredient tags */}
              {/* <View className="flex-row flex-wrap">
                {["Potato 100g", "Rice 150g", "Lettuce 150g"].map((item, index) => (
                  <View
                    key={index}
                    className="bg-[#F9F9F9] border border-[#DDDDDD] rounded-xl px-4 py-3 mr-2 mb-2 flex-row items-center"
                  >
                    <Text className="text-[#333333] mr-3">{item}</Text>
                    <TouchableOpacity className="bg-white rounded-full w-6 h-6 items-center justify-center border border-[#DDDDDD]">
                      <Ionicons name="close" size={16} color="#777777" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View> */}
              <IngredientSelector
            showModal={showIngredientSelector}
            handleShowModal={setShowIngredientSelector}
            handleAddIngredient={(e: DishIngredient) => handleAddIngredient(e)}
          ></IngredientSelector>
            </View>

            {/* Total Footprint Section */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#006400] mb-3">TOTAL FOOTPRINT</Text>

              <View className="items-center bg-[#F9F9F9] border border-[#DDDDDD] rounded-xl px-6 py-8">
                {/* Grade bubble */}
                <View className="mb-4">
                  <View className="w-24 h-24 rounded-full items-center justify-center shadow-sm" style={{ backgroundColor: gradeColor }}>
                    <Text className="text-white text-5xl font-bold">{grade}</Text>
                  </View>
                </View>

                {/* Rating bar */}
                <View className="flex-row items-center mb-4 w-64 h-5 overflow-hidden rounded-full">
                  <View className="h-full flex-1 bg-[#74B318]" />
                  <View className="h-full flex-1 bg-[#A4D056]" />
                  <View className="h-full flex-1 bg-[#FFDA44]" />
                  <View className="h-full flex-1 bg-[#F87171]" />
                </View>

                {/* Emissions */}
                <CalculateTotalCarbon ingredientList={ingredientList} onCarbonCalculated={setTotalCarbon}/>

                {/* Explanation link */}
                <TouchableOpacity className="mt-2"
                  onPress={() => setShowExplanationModal(true)}
                >
                <Text className="text-[#74B318] font-medium">What does this label mean?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
      visible={showExplanationModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowExplanationModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50  bg-opacity-40">
          <View className="bg-white rounded-2xl p-6 w-80 shadow-md">
            <Text className="text-xl font-bold text-[#006400] mb-3">Grade Explanation</Text>
            <Text className="text-[#333333] text-base mb-4">
              • A (Excellent): Less than 1 g CO₂{'\n'}
              • B (Good): 1–4.9 g CO₂{'\n'}
              • C (Moderate): 5–19.9 g CO₂{'\n'}
              • D (High): 20+ g CO₂
            </Text>
            <TouchableOpacity
              className="self-end mt-2 px-4 py-2 bg-[#74B318] rounded-md"
                onPress={() => setShowExplanationModal(false)}
            >
              <Text className="text-white font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
