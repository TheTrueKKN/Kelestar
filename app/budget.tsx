import Slider from "@react-native-community/slider";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

export default function Budget() {
  const [carbonBudget, setCarbonBudget] = useState(5.5);
  const [localValue, setLocalValue] = useState(5.5);

  const handleSave = () => {
    console.log("Carbon budget saved:", carbonBudget);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-[19px] mt-[20px]">
        <Text className="font-psemibold text-[28px] leading-[42px] text-[#1E1F1F]">
          Set up daily carbon budget
        </Text>
        
        <View className="mt-[40px]">
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={10}
            value={carbonBudget}
            onValueChange={(value) => setLocalValue(value)}
            onSlidingComplete={(value) => setCarbonBudget(value)}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4CAF50"
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-sm font-pregular">0kg</Text>
            <Text className="text-sm font-pregular">10kg</Text>
          </View>
          <Text className="text-lg font-psemibold my-4 text-center">{localValue.toFixed(1)}kg CO₂e</Text>
          <TouchableOpacity
            onPress={handleSave}
            className="bg-green py-3 rounded-lg"
          >
            <Text className="text-white text-center font-psemibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}