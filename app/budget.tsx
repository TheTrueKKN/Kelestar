import Slider from "@react-native-community/slider";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getCustomerByUser,
  updateCustomer,
} from "../controllers/customerController";

const Budget = ({ handleBudgetSaved }: { handleBudgetSaved: () => void }) => {
  const [carbonBudget, setCarbonBudget] = useState(5.5);
  const [localValue, setLocalValue] = useState(5.5);

  useEffect(() => {
    const initCarbonBudget = async () => {
      const retrievedCustomer = await getCustomerByUser();
      if (retrievedCustomer && retrievedCustomer.customer_carbon_budget) {
        setCarbonBudget(retrievedCustomer.customer_carbon_budget);
      }
    };
    initCarbonBudget();
  }, []);

  const handleSave = async () => {
    const updateCarbonBudgetSuccess = await updateCustomer({
      customer_carbon_budget: Math.round((carbonBudget + Number.EPSILON) * 100) / 100,
    });
    if (updateCarbonBudgetSuccess) {
      // console.log("Carbon budget saved:", carbonBudget);
      handleBudgetSaved();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-[19px] mt-[20px]">
        <Text className="font-psemibold text-[28px] leading-[42px] text-[#1E1F1F]">
          Set up your daily carbon budget
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
            <Text className="text-sm font-pregular">0g</Text>
            <Text className="text-sm font-pregular">10g</Text>
          </View>
          <Text className="text-lg font-psemibold my-4 text-center">
            {localValue.toFixed(1)}g CO₂e
          </Text>
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
};

export default Budget;
