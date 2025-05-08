import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import FormSearchField from "./FormSearchField";
import { Ingredient } from "../interfaces/ingredient";
import { getIngredientListing } from "../controllers/ingredientController";
import { SelectOption } from "../interfaces/shared";
import { DishIngredient } from "../interfaces/dishIngredient";

interface Props {
  showModal: boolean;
  handleShowModal: (b: boolean) => void;
  handleAddIngredient: (e: DishIngredient) => void;
}

const IngredientSelector = ({
  showModal,
  handleShowModal,
  handleAddIngredient,
}: Props) => {
  const [ingredientId, setIngredientId] = useState("");
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientWeight, setIngredientWeight] = useState(0);
  const [ingredientList, setIngredientList] = useState<Ingredient[] | null>();
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const retrieveIngredients = async () => {
      const retrievedIngredientList = await getIngredientListing();
      setIngredientList(retrievedIngredientList);
      // console.log("retrieved ingredient list:", retrievedIngredientList);
      if (retrievedIngredientList) {
        const mappedOptions: SelectOption[] = retrievedIngredientList.map(
          (ingredient: Ingredient) => ({
            displayText: ingredient.ingredient_name,
            value: ingredient.id,
          })
        );
        setSelectOptions(mappedOptions);
        // console.log("options", mappedOptions);
      }
    };
    retrieveIngredients();
  }, []);

  // const ingredientsAvailable = [
  //   "banana",
  //   "rice",
  //   "corn",
  //   "potato",
  //   "chicken",
  //   "curry",
  //   "fish",
  //   "pop corn",
  //   "corn dog",
  //   "corn fish",
  //   "corn chicken",
  //   "corn rice",
  //   "corn human",
  //   "corn cat",
  //   "corn banana",
  // ];
  const handleSavePressed = () => {
    console.log("search term:", ingredientName);
    const searchedIngredient = ingredientList
      ? ingredientList.find((option) => (option.ingredient_name === ingredientName))
      : null;
      
    setIngredientWeight(Number(ingredientWeight));
    if (searchedIngredient && ingredientWeight > 0) {
      // console.log("searched ingredient:", searchedIngredient);
      const dishIngredient: DishIngredient = {
        ingredient_id: searchedIngredient.id,
        ingredient_amount: ingredientWeight
      }
      handleAddIngredient(dishIngredient);

      handleShowModal(false);
      setIngredientName("");
      setIngredientWeight(0);
      //Alert.alert(`${ingredientWeight}g of ${ingredientName} added`);
    } 
    else if (!searchedIngredient){
      Alert.alert("Please enter a valid ingredient");
    }
    else if (ingredientWeight <= 0) {
      // console.log("ingredientWeight", ingredientWeight, typeof(ingredientWeight))
      Alert.alert("Please enter a valid ingredient weight");
    }
    // console.log("ingredientWeight", ingredientWeight + 5, typeof(ingredientWeight))
  };

  const handleCloseButtonPressed = () => {
    handleShowModal(false);
    setIngredientName("");
    setIngredientWeight(0);
  }

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
              onPress={handleCloseButtonPressed}
              className="absolute top-0 right-0 h-20 w-20 rounded-full z-10"
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
              placeholder="Search for an ingredient"
              options={selectOptions}
              handleChangeText={(e: string) => {
                setIngredientName(e);
              }}
            />

            <FormField
              title="Weight (gram)"
              value={ingredientWeight}
              placeholder="Enter ingredient weight"
              handleChangeText={setIngredientWeight}
              keyboardType="number-pad"
              inputMode="numeric"
              otherStyles="mt-5"
            ></FormField>

            {/* Close button */}
            <CustomButton
              title="Save ingredient"
              handlePress={handleSavePressed}
              containerStyles="w-48 self-center"
            ></CustomButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IngredientSelector;
