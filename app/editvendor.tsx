import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const galleryIcon = require('../assets/icons/gallery.png'); // Adjust the path to your gallery icon

export default function EditVendorPage() {
  const [vendorName, setVendorName] = useState(''); // Vendor name state
  const [thumbnailImage, setThumbnailImage] = useState(''); // Thumbnail image state
  const [vendorDescription, setVendorDescription] = useState(''); // Vendor description state
  const [wordCount, setWordCount] = useState(0); // Word count for vendor description
  const router = useRouter(); // Initialize router

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setThumbnailImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  // Handle description change and word count
  const handleDescriptionChange = (text: string) => {
    const wordsArray = text.trim().split(/\s+/);
    if (wordsArray.length <= 100) { // Limit to 100 words
      setVendorDescription(text);
      setWordCount(wordsArray.length);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white">
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

          <View className="px-5 py-8">
            {/* Title */}
            <Text className="text-xl font-bold text-[#006400] mb-5">
              Would you like to make changes to your vendor details?
            </Text>

            {/* Vendor Name Input */}
            <Text className="text-base text-[#006400] mb-2">Vendor name:</Text>
            <TextInput
              className="h-12 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-4"
              placeholder="Enter your vendor name"
              value={vendorName}
              onChangeText={setVendorName}
            />

            {/* Thumbnail Image Upload */}
            <Text className="text-base text-[#006400] mb-2">Edit thumbnail image:</Text>
            <TouchableOpacity
              className="h-40 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md justify-center items-center mb-4"
              onPress={pickImage}
            >
              {thumbnailImage ? (
                <Image
                  source={{ uri: thumbnailImage }}
                  className="w-full h-full rounded-md"
                  resizeMode="cover"
                />
              ) : (
                <>
                  <Image
                    source={galleryIcon}
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-black">Upload your thumbnail here</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Vendor Description Input */}
            <Text className="text-base text-[#006400] mb-2">Edit vendor description:</Text>
            <TextInput
              className="h-40 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-2"
              placeholder="Enter your vendor description"
              value={vendorDescription}
              onChangeText={handleDescriptionChange}
              multiline={true}
            />

            {/* Word Count */}
            <Text className="text-sm text-[#006400]">{wordCount}/100 words</Text>

            {/* Save Changes Button */}
            <TouchableOpacity
              className="bg-[#74B318] h-12 rounded-md justify-center items-center mt-6"
              onPress={() => {
                alert('Changes saved successfully');
                router.push('/vendordetail'); // Navigate back to vendor detail after saving
              }}
            >
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
