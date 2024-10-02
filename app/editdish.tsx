import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const galleryIcon = require('../assets/icons/gallery.png'); // Adjust the path to your gallery icon

export default function EditDishPage() {
  const [dishName, setDishName] = useState(''); // State for the dish name
  const [dishPrice, setDishPrice] = useState(''); // State for the dish price
  const [thumbnailImage, setThumbnailImage] = useState(''); // State for the thumbnail image
  const router = useRouter(); // Initialize the router

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setThumbnailImage(result.assets[0].uri); // Set the selected image URI
    }
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
                placeholder={dishPrice ? dishPrice : 'Enter dish price'}
                value={dishPrice}
                onChangeText={setDishPrice}
                keyboardType="numeric" // Numeric keyboard for price input
              />

              {/* Thumbnail Image Upload Box */}
              <Text className="text-base text-[#006400] mb-2">Edit thumbnail image:</Text>
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
                    <Text className="text-gray-600">Upload your thumbnail here</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Ingredients Section */}
              <Text className="text-base text-[#006400] mb-2">Edit Ingredients:</Text>
              <TouchableOpacity
                className="h-10 bg-[#74B318] rounded-md justify-center items-center mb-6"
                onPress={() => {
                  // Logic for editing ingredients
                  console.log('Edit ingredients button pressed');
                }}
              >
                <Text className="text-white text-base font-bold">Edit Ingredients</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Save Changes Button */}
        <View className="px-5 py-4 bg-white">
          <TouchableOpacity
            className="h-12 bg-[#74B318] rounded-md justify-center items-center"
            onPress={() => {
              // Logic for saving the changes
              alert('Dish details updated successfully!');
              router.push('/createdish'); // Navigate back to createdish page
            }}
          >
            <Text className="text-white text-lg font-bold">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
