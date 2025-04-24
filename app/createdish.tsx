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
import IngredientSelector from "../components/IngredientSelector";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Ingredient } from "../interfaces/ingredient";
import { DishIngredient } from "../interfaces/dishIngredient";
const galleryIcon = require("../assets/icons/gallery.png"); // Adjust the path to your gallery icon

// Newly added
import { insertDish } from "../controllers/dishController";
import { Base64Image } from '../interfaces/base64image';
import { Dish } from "../interfaces/dish";
import { insertDishIngredient } from "../controllers/dishIngredientController";
import DishIngredientItem from "../components/DishIngredientItem";


export default function CreateDishPage() {
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(""); // State for thumbnail image
  const [ingredientList, setIngredientList] = useState<DishIngredient[]>([]);
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const router = useRouter(); // Initialize router

  const [base64String, setBase64String] = useState('');

  const { prevPage, vendorId } = useGlobalSearchParams();
  const [dishes, setDishes] = useState([]);

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true, // Ensure the image is returned as a base64 string
        });

    if (!result.canceled  && result.assets?.[0]?.base64) {
      const {base64} = result.assets[0];
      setBase64String(base64);
      setThumbnailImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  const handleAddIngredient = (dishIngredient: DishIngredient) => {
  //  console.log("Adding into list")
   const newList = [...ingredientList, dishIngredient]
  //  setIngredientList(newList);
   
   setIngredientList((ingredientList) => [...ingredientList, dishIngredient]);
   console.log(`Current ing list: ${JSON.stringify(newList, null, 2)} `);
  };



  const base64Image: Base64Image = {
        base64: base64String,
        uri: thumbnailImage
  }

  // Function to handle Dish creation
  const handleCreateDish = async () => {
    const newDish: Dish = {
      id: Math.random().toString(), // Generate a unique ID
      dish_name: dishName, // Assuming dishName is already a string from input
      dish_price: Number(dishPrice), // Make sure the price is a number or string as per the type
      dish_image_name: thumbnailImage, // Assuming thumbnailImage is a string (URI to the image)
    };

        /**
   @todo: (only do step 1 in this function, do step 2 and 3 in other functions)
   3. insert list of DishIngredient into supabase
    **/

   
   // 2. insert dish into supabase after "create dish" is pressed
   const finalVendorId = Array.isArray(vendorId) ? vendorId[0] : vendorId;
  // console.log(`Current data, vendorId: ${finalVendorId}, curr dish: ${JSON.stringify(newDish)}`)
   const [dishId, insertDishSuccess] = await insertDish(finalVendorId, newDish, base64Image);
    
   // Insert dishIngredient into Supabase
   
   if (dishId == null){
     return 
   }
   
   const insertDishIngredientSuccess = await insertDishIngredient(dishId, ingredientList)

    // Navigate back to the dishes page

    if(insertDishSuccess && insertDishIngredientSuccess){
      // Settign the attributes to empty after Dish creation
      setDishName("");
      setDishPrice("");
      setThumbnailImage("");

      // Route back to previous
      router.back();
      router.replace({pathname: "/initialmenu"})
    }
    // const validPrevpage = Array.isArray(prevPage) ? prevPage[0] : prevPage;
    // if (newDish.dishName != "" || newDish.dishPrice != 0) {
    //   router.replace({
    //     pathname: validPrevpage, // Use the passed previous page
    //     params: { newDish: JSON.stringify(newDish) },
    //   });
    // } else {
    //   // router.replace({
    //   //   pathname:validPrevpage
    //   // })
    //   router.back();
    // }
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
                Dish image:
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
              <ScrollView className="h-60" showsVerticalScrollIndicator={false}>
                  {ingredientList.length === 0 ? (
                    <Text className="text-gray-400 text-center mt-4">No ingredients added yet.</Text>
                  ) : 
                  (
                    ingredientList.map((dishIngredient) => (
                    <DishIngredientItem
                    key={dishIngredient.id}
                    dishIngredient={dishIngredient}

                    />
                    ))
                  )
                }
              </ScrollView>
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
              // router.push({ pathname: '/menu', params: { vendorUri, dishUri: thumbnailImage }})
              handleCreateDish();
            }}
          >
            <Text className="text-white text-lg font-bold">Create dish</Text>
          </TouchableOpacity>

          {/* Button to navigate to EditDishPage */}
          {/* <TouchableOpacity
            className="h-12 bg-[#006400] rounded-md justify-center items-center"
            onPress={() => router.push("/editdish")} // Navigate to EditDishPage
          >
            <Text className="text-white text-lg font-bold">
              Edit Dish Details
            </Text>
          </TouchableOpacity> */}
          <IngredientSelector
            showModal={showIngredientSelector}
            handleShowModal={setShowIngredientSelector}
            handleAddIngredient={(e: DishIngredient) => handleAddIngredient(e)}
            
          ></IngredientSelector>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}