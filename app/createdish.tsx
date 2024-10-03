import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import IngredientSelector from "../components/IngredientSelector";

const galleryIcon = require("../assets/icons/gallery.png"); // Adjust the path to your gallery icon

export default function CreateDishPage() {
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(""); // State for thumbnail image
  const [ingredientList, setIngredientList] = useState<String[]>([]);
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const router = useRouter(); // Initialize router

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setThumbnailImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  const handleAddIngredient = (ingredient: string) => {
    ingredientList.push(ingredient);
    console.log(ingredientList);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 bg-white">
            {/* StatusBar setup */}
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View className="px-5 py-8">
              <Text className="text-2xl font-bold text-[#006400] mb-5">
                Ready to craft a new dish?
              </Text>

              {/* Dish Name Input */}
              <Text className="text-base text-[#006400] mb-2">Dish name:</Text>
              <TextInput
                className="h-12 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-4"
                placeholder="Enter dish name"
                value={dishName}
                onChangeText={setDishName}
              />

              {/* Dish Price Input */}
              <Text className="text-base text-[#006400] mb-2">Dish price:</Text>
              <TextInput
                className="h-12 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-4"
                placeholder="Enter dish price"
                value={dishPrice}
                onChangeText={setDishPrice}
                keyboardType="numeric" // Numeric keyboard for price input
              />

              {/* Thumbnail Image Upload Box */}
              <Text className="text-base text-[#006400] mb-2">
                Thumbnail image:
              </Text>
              <TouchableOpacity
                className="h-40 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md justify-center items-center mb-4"
                onPress={pickImage} // Call pickImage function when pressed
              >
                {thumbnailImage ? (
                  <Image
                    source={{ uri: thumbnailImage }} // Show selected image
                    className="w-full h-full rounded-md" // Adjust styling as needed
                    resizeMode="cover" // Maintain aspect ratio
                  />
                ) : (
                  <>
                    <Image
                      source={galleryIcon}
                      className="w-12 h-12 mb-2" // Adjust icon size as needed
                    />
                    <Text className="text-gray-600">
                      Upload your thumbnail here
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Ingredients Section */}
              <Text className="text-base text-[#006400] mb-2">
                Ingredients:
              </Text>
              <TouchableOpacity
                className="h-10 bg-[#74B318] rounded-md justify-center items-center mb-6"
                onPress={() => {
                  // Add functionality for adding ingredients
                  setShowIngredientSelector(true);
                  console.log("Add ingredients button pressed");
                }}
              >
                <Text className="text-white text-base font-bold">
                  + add ingredients
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Create New Dish Button */}
        <View className="px-5 py-4 bg-white">
          <TouchableOpacity
            className="h-12 bg-[#74B318] rounded-md justify-center items-center mb-4"
            onPress={() => {
              // Add functionality for creating the new dish
              console.log("Create new dish button pressed");
            }}
          >
            <Text className="text-white text-lg font-bold">Create dish</Text>
          </TouchableOpacity>

          {/* Button to navigate to EditDishPage */}
          <TouchableOpacity
            className="h-12 bg-[#006400] rounded-md justify-center items-center"
            onPress={() => router.push("/editdish")} // Navigate to EditDishPage
          >
            <Text className="text-white text-lg font-bold">
              Edit Dish Details
            </Text>
          </TouchableOpacity>
          <IngredientSelector
            showModal={showIngredientSelector}
            handleShowModal={setShowIngredientSelector}
            handleAddIngredient={(e: string) => handleAddIngredient(e)}
          ></IngredientSelector>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
