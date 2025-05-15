import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Dish } from '../interfaces/dish';
import { JoinedDishIngredient } from '../interfaces/joinedDishIngredient'
import { Base64Image } from '../interfaces/base64image';
import { updateDish } from '../controllers/dishController';
import { joinDishIngredient } from '../controllers/dishIngredientJoinController';
import DishIngredientItem from '../components/DishIngredientItem';
import IngredientSelector from '../components/IngredientSelector';
import { DishIngredient } from '../interfaces/dishIngredient';
import { getIngredientName } from '../controllers/ingredientController';
import { updateDishIngredient } from '../controllers/dishIngredientController';
import CalculateTotalCarbon from '../components/CalculateTotalCarbon';
import { updateVendorGreenScore } from '../controllers/vendorController';
const galleryIcon = require('../assets/icons/gallery.png'); // Adjust the path to your gallery icon

export default function EditDishPage() {
  const [dishId, setDishId] = useState(''); 
  const [dishName, setDishName] = useState(''); // State for the dish name
  const [dishPrice, setDishPrice] = useState(0); // State for the dish price
  const [dishImageName, setDishImageName] = useState('');
  const [dishUri, setDishUri] = useState(''); // State for the thumbnail image
  const router = useRouter(); // Initialize the router
  const [totalCarbon, setTotalCarbon] = useState(0)
  
  // Newly added 
  const { id, dish_name, dish_price, dish_image_name, dish_url, dish_vendor_id, prev_page } = useGlobalSearchParams();
  const [base64String, setBase64String] = useState("");
  const [dishIngredientList, setDishIngredientList] = useState<JoinedDishIngredient[]>([]);
   const [showIngredientSelector, setShowIngredientSelector] = useState(false);

  useEffect(() => {
      setDishId(id as string)
      setDishName(dish_name as string)
      setDishPrice(Number(dish_price))
      setDishImageName(dish_image_name as string)
      setDishUri(dish_url as string)

      const fetchDishIngredients = async () => {
        const result = await joinDishIngredient(id as string);
        if (result) {
          setDishIngredientList(result);
        } else {
          console.warn("Failed to fetch dish ingredients.");
        }
      };
    
      fetchDishIngredients();
      
    }, []);
  

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Open the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true, // Ensure the image is returned as a base64 string
        });

    if (!result.canceled && result.assets?.[0]?.base64) {
      const { base64 } = result.assets[0];
      setBase64String(base64);
      setDishUri(result.assets[0].uri); // Set the selected image URI
    }
  };

  const handleSubmit = async () => {
    const dish: Dish = {
      id: dishId,
      dish_name: dishName,
      dish_price: dishPrice,
      dish_image_name: dishImageName,
      dish_total_carbon: totalCarbon,
    };

    const base64Image: Base64Image = {
          base64: base64String,
          uri: dishUri,
        };

    const updateDishSuccess = await updateDish(dish, base64Image);

    const updateDishIngredientSuccess = await updateDishIngredient(dishId, dishIngredientList)

    await updateVendorGreenScore(dish_vendor_id as string)
    
    if (updateDishSuccess && updateDishIngredientSuccess){
      router.back()
      router.replace({pathname: prev_page as string})
    }
  }

  const handleAddIngredient = async (dishIngredient: DishIngredient) => {
    try {
      // Fetch full ingredient info by ID
      const ingredientName = await getIngredientName(dishIngredient.ingredient_id as string)
  
      // Build the JoinedDishIngredient format
      const joinedIngredient: JoinedDishIngredient = {
        ingredient_amount: dishIngredient.ingredient_amount as number,
        ingredient: {
          id: dishIngredient.ingredient_id as string,
          ingredient_name: ingredientName?.[0]['ingredient_name'],
          ingredient_footprint: totalCarbon
        }
      };
  
      // Add to the state list
      setDishIngredientList((prevList) => [...prevList, joinedIngredient]);

      //console.log(`Current ingredient list: ${JSON.stringify(dishIngredientList)}`)


      //console.log(`Current joined list: ${JSON.stringify([...ingredientList, joinedIngredient], null, 2)}`);
    } catch (err) {
      console.error('Failed to add ingredient:', err);
    }
  };
  

  const removeIngredient = async (ingredientId: string) => {
    setDishIngredientList((ingredientList) => ingredientList.filter(allIngredient => allIngredient.ingredient.id !== ingredientId))
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 bg-white">
            {/* StatusBar setup */}
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View className="px-5 py-8">
              <Text className="text-2xl font-bold text-[#006400] mb-5">Would you like to edit your dish details?</Text>

              {/* Dish Name Input */}
              <Text className="text-base text-[#006400] mb-2">Edit dish name:</Text>
              <TextInput
                className="h-12 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-4"
                placeholder={dishName ? dishName : 'Enter dish name'}
                value={dishName}
                onChangeText={setDishName}
              />

              {/* Dish Price Input */}
              <Text className="text-base text-[#006400] mb-2">Edit dish price:</Text>
              <TextInput 
                className="h-12 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-4"
                placeholder={dishPrice ? dishPrice.toString() : 'Enter dish price'}
                value={dishPrice.toString()}
                onChangeText={(text) => setDishPrice(Number(text) || 0)}
                keyboardType="numeric"
              />

              {/* Thumbnail Image Upload Box */}
              <Text className="text-base text-[#006400] mb-2">Edit thumbnail image:</Text>
              <TouchableOpacity
                className="h-40 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md justify-center items-center mb-4"
                onPress={pickImage} // Call pickImage function when pressed
              >
                {dishUri ? (
                  <Image
                    source={{ uri: dishUri }} // Show selected image
                    className="w-full h-full rounded-md" // Adjust styling as needed
                    resizeMode="cover" // Maintain aspect ratio
                  />
                ) : (
                  <>
                    <Image
                      source={galleryIcon}
                      className="w-12 h-12 mb-2" // Adjust icon size as needed
                    />
                    <Text className="text-gray-600">Upload your thumbnail here</Text>
                  </>
                )}
              </TouchableOpacity>

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


              <Text className="text-base text-[#006400] mb-2">Edit Ingredients:</Text>

              <ScrollView className="h-60" showsVerticalScrollIndicator={false}>
                  {dishIngredientList.length === 0 ? (
                    <Text className="text-gray-400 text-center mt-4">No ingredients added yet.</Text>
                  ) : 
                  (
                    dishIngredientList.map((dishIngredient) => (
                    <DishIngredientItem
                    key={dishIngredient.ingredient.id}
                    dishIngredient={dishIngredient}
                    ingredientName={dishIngredient.ingredient.ingredient_name}
                    onDelete={() => removeIngredient(dishIngredient.ingredient.id!)} 

                    />
                    ))
                  )
                }
              </ScrollView>
            </View>
          </View>
        </ScrollView>

        {/* Save Changes Button */}
        <View className="px-5 py-4 bg-white">
          <CalculateTotalCarbon joinedIngredientList={dishIngredientList} onCarbonCalculated={setTotalCarbon}/>
          <TouchableOpacity
            className="h-12 bg-[#74B318] rounded-md justify-center items-center"
            onPress={() => {
              // Logic for saving the changes
              alert('Dish details updated successfully!');
              handleSubmit(); // Navigate back to intial menu page
            }}
          >
            <Text className="text-white text-lg font-bold">Save Changes</Text>
          </TouchableOpacity>

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
