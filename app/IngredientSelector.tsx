import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import FormSearchField from "../components/FormSearchField";

const IngredientSelector = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredient, setIngredient] = useState("");
  const [ingredientWeight, setIngredientWeight] = useState(0);

  return (
    <View className="flex-1 justify-center items-center">
      {/* Button to trigger the popup */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-blue-500 p-4 rounded-lg"
      >
        <Text className="text-white font-urbanistbold">Open Popup</Text>
      </TouchableOpacity>
      <Text>
        asdddddddddddddddddddddddddddddddddddddd/nadsssssssssssssssssssssssssssssssss/nsdafdzxggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggf
      </Text>

      {/* Modal for Popup */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-white/50 backdrop-blur-sms">
          {/* Popup Content */}
          <View className="bg-white w-80 p-6 rounded-lg shadow-lg">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-0 right-0 h-20 w-20 rounded-full z-100"
            >
              <Text className="text-black text-xl font-bold absolute top-4 right-4">
                ✕
              </Text>
            </TouchableOpacity>
            <Text className="text-2xl font-urbanistbold text mb-5">
              Add ingredient
            </Text>
            <FormSearchField
              title="Select Ingredient"
              value={ingredient}
              placeholder="Search for an ingredient"
              options={[
                "banana",
                "rice",
                "corn",
                "potato",
                "chicken",
                "fried rice",
                "curry",
                "fish",
                "pop corn",
                "corn dog",
                "corn fish",
                "corn chicken",
                "corn rice",
                "corn human",
                "corn cat",
              ]}
              handleChangeText={(e: string) => {
                setIngredient(e);
              }}
            />

            <FormField
              title="Weight (gram)"
              value={ingredientWeight}
              placeholder="Enter ingredient weight"
              handleChangeText={() => setIngredientWeight(ingredientWeight)}
              keyboardType="number-pad"
              inputMode="numeric"
              otherStyles="mt-5"
            ></FormField>

            {/* Close button */}
            <CustomButton
              title="Save ingredient"
              handlePress={() => setModalVisible(false)}
              containerStyles="w-48 self-center"
            ></CustomButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IngredientSelector;
