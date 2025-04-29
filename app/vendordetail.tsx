import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { insertVendor } from '../controllers/vendorController';
import { Vendor } from '../interfaces/vendor';
import { Base64Image } from '../interfaces/base64image';

const galleryIcon = require('../assets/icons/gallery.png'); // Adjust the path to your gallery icon

export default function VendorDetailPage() {
  const [vendorName, setVendorName] = useState('');
  const [uri, setUri] = useState('');
  const [base64String, setBase64String] = useState('');
  const [vendorDescription, setVendorDescription] = useState(''); // State for vendor description
  const [wordCount, setWordCount] = useState(0); // State for word count
  const router = useRouter(); // Initialize router

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Open the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Ensure the image is returned as a base64 string
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      const {base64} = result.assets[0];
      //console.log(`Testing: ${JSON.stringify(result)}`)
      setBase64String(base64);
      setUri(result.assets[0].uri); // Set the selected image URI      
    }
  };

  // Function to handle description change and word count
  const handleDescriptionChange = (text: string) => {
    const wordsArray = text.trim().split(/\s+/); // Split by spaces to count words
    if (wordsArray.length <= 100) { // Limit to 100 words
      setVendorDescription(text); // Update the description
      setWordCount(wordsArray.length); // Update the word count
    }
  };

  const handleSubmit = async() => {
    if (!(vendorName && vendorDescription && base64String && uri)) {
      Alert.alert("Please provide a vendor name, description and a photo");
      return;
    }
    const vendor:Vendor = {
      vendor_name: vendorName,
      vendor_description: vendorDescription
    }
    const base64Image: Base64Image = {
      base64: base64String,
      uri: uri
    }
    const insertVendorSuccess = await insertVendor(vendor, base64Image);
    if (insertVendorSuccess) {
      router.dismissAll();
      router.replace({ pathname: '/initialmenu', params: { vendorName:vendorName, vendorDesc: vendorDescription, vendorUri: uri }});
    }
  }

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{ flex: 1 }}
    // >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white">
          {/* StatusBar setup */}
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

          {/* Header */}
          <View className="px-5 py-8">
            <Text className="text-2xl font-bold text-[#006400] mb-5">
              Let's set up your vendor information!
            </Text>

            {/* Vendor Name Input */}
            <Text className="text-base text-[#006400] mb-2">Vendor name:</Text>
            <TextInput
              className="h-12 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-4"
              placeholder="Enter your vendor name"
              value={vendorName}
              onChangeText={setVendorName}
            />

            {/* Thumbnail Image Upload Box */}
            <Text className="text-base text-[#006400] mb-2">Thumbnail image:</Text>
            <TouchableOpacity
              className="h-40 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md justify-center items-center mb-4"
              onPress={pickImage} // Call pickImage function when pressed
            >
              {uri ? (
                <Image 
                  source={{ uri: uri }} // Show selected image
                  className="w-full h-full rounded-md" // Adjust styling as needed
                  resizeMode="cover" // Maintain aspect ratio
                />
              ) : (
                <>
                  <Image 
                    source={galleryIcon} 
                    className="w-12 h-12 mb-2" // Adjust icon size as needed
                  />
                  <Text className="text-black">Upload your thumbnail here</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Vendor Description Input */}
            <Text className="text-base text-[#006400] mb-2">Vendor description:</Text>
            <TextInput
              className="h-40 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-2"
              placeholder="Enter your vendor description"
              value={vendorDescription}
              onChangeText={handleDescriptionChange} // Update state on text change and limit to 100 words
              multiline={true} // Allow multiple lines
            />

            {/* Word Count */}
            <Text className="text-sm text-[#006400]">{wordCount}/100 words</Text>

            {/* Next Step Button */}
            {/* Passing in vendorName, vendorDesription and Thumbnail image to Initial menu */}
            <TouchableOpacity
              className="bg-[#74B318] h-12 rounded-md justify-center items-center mt-6"
              onPress={() => handleSubmit()} // Navigate to createdish page
            >
              <Text className="text-white font-bold text-lg">Next Step</Text>
            </TouchableOpacity>

            {/* Temporary Link to Edit Vendor Page */}
            {/* <View className="mt-4">
              <TouchableOpacity
                className="bg-[#74B318] h-12 rounded-md justify-center items-center"
                onPress={() => router.push('/editvendor')} // Navigate to editvendor page
              >
                <Text className="text-white font-bold text-lg">Edit Vendor Details</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </ScrollView>
    // </KeyboardAvoidingView>
  );
}
