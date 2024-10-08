import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import FormSearchField from "./FormSearchField";

interface Props {
  showModal: boolean;
  handleShowModal: (b: boolean) => void;
  handleAddIngredient: (e: string) => void;
}

const IngredientSelector = ({
  showModal,
  handleShowModal,
  handleAddIngredient,
}: Props) => {
  const [ingredient, setIngredient] = useState("");
  const [ingredientWeight, setIngredientWeight] = useState(0);
  const ingredientsAvailable = [
    "banana",
    "rice",
    "corn",
    "potato",
    "chicken",
    "curry",
    "fish",
    "pop corn",
    "corn dog",
    "corn fish",
    "corn chicken",
    "corn rice",
    "corn human",
    "corn cat",
    "corn banana",
  ];

  return (
    <View className="justify-center items-center">
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => {
          handleShowModal(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/30 backdrop-blur-sm">
          {/* Popup Content */}
          <View className="bg-white w-80 p-6 rounded-lg shadow-lg shadow-gray-200">
            <TouchableOpacity
              onPress={() => handleShowModal(false)}
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
              options={ingredientsAvailable}
              handleChangeText={(e: string) => {
                setIngredient(e);
                handleAddIngredient(e);
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
              handlePress={() => handleShowModal(false)}
              containerStyles="w-48 self-center"
            ></CustomButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IngredientSelector;
