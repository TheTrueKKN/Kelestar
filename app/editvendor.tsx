import React, { useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Vendor } from "../interfaces/vendor";
import { getVendorByUser, updateVendor } from "../controllers/vendorController";
import { Base64Image } from "../interfaces/base64image";

const galleryIcon = require("../assets/icons/gallery.png"); // Adjust the path to your gallery icon

export default function EditVendorPage() {
  const [editVendorName, setVendorName] = useState(""); // Vendor name state
  const [editUri, setUri] = useState(""); // Thumbnail image state
  const [base64String, setBase64String] = useState("");
  const [editVendorDescription, setVendorDescription] = useState(""); // Vendor description state
  const [wordCount, setWordCount] = useState(0); // Word count for vendor description
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const setVendorValues = async () => {
      const result = await getVendorByUser();
      if (result) {
        setVendorName(result.vendor_name);
        setVendorDescription(result.vendor_description);
        if (result.vendor_image_url) {
          setUri(result.vendor_image_url);
          // console.log("thumbnailimage", editUri);
        }
      }
    };
    setVendorValues();
  }, []);

  const { prevPage } = useGlobalSearchParams();

  const validPrevpage = Array.isArray(prevPage) ? prevPage[0] : prevPage;

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
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
      setUri(result.assets[0].uri); // Set the selected image URI
    }
  };

  // Handle description change and word count
  const handleDescriptionChange = (text: string) => {
    const wordsArray = text.trim().split(/\s+/);
    if (wordsArray.length <= 100) {
      // Limit to 100 words
      setVendorDescription(text);
      setWordCount(wordsArray.length);
    }
  };

  // Function to handle any changes to vendor detail
  // const handleVendorDetail = () => {
  //   // Navigate back to the dishes page
  //   const validPrevpage = Array.isArray(prevPage) ? prevPage[0] : prevPage;
  //   if (editVendorName != '' || editVendorDescription != '' || editUri != ''){
  //     router.replace({

  //       pathname: validPrevpage, // Use the dynamically passed previous page
  //       params: { newVendorName: editVendorName , newVendorDesc:editVendorDescription, newImg: editUri }
  //     });

  //   }
  //   else{
  //     router.back()
  //   }

  // };

  const handleSubmit = async () => {
    const vendor: Vendor = {
      vendor_name: editVendorName,
      vendor_description: editVendorDescription,
    };
    const base64Image: Base64Image = {
      base64: base64String,
      uri: editUri,
    };
    const updateVendorSuccess = await updateVendor(vendor, base64Image);
    if (updateVendorSuccess) {
      router.back();
      router.replace({
        pathname: validPrevpage, // Use the dynamically passed previous page
        params: {
          newVendorName: editVendorName,
          newVendorDesc: editVendorDescription,
          newImg: editUri,
        },
      });
    }
  };

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{ flex: 1 }}
    // >
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
            value={editVendorName}
            onChangeText={setVendorName}
          />

          {/* Thumbnail Image Upload */}
          <Text className="text-base text-[#006400] mb-2">
            Edit thumbnail image:
          </Text>
          <TouchableOpacity
            className="h-40 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md justify-center items-center mb-4"
            onPress={pickImage}
          >
            {editUri ? (
              <Image
                source={{ uri: editUri }}
                className="w-full h-full rounded-md"
                resizeMode="cover"
              />
            ) : (
              <>
                <Image source={galleryIcon} className="w-12 h-12 mb-2" />
                <Text className="text-black">Upload your thumbnail here</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Vendor Description Input */}
          <Text className="text-base text-[#006400] mb-2">
            Edit vendor description:
          </Text>
          <TextInput
            className="h-40 bg-[#F9F9F9] border border-[#DDDDDD] rounded-md px-4 mb-2"
            placeholder="Enter your vendor description"
            value={editVendorDescription}
            onChangeText={handleDescriptionChange}
            multiline={true}
          />

          {/* Word Count */}
          <Text className="text-sm text-[#006400]">{wordCount}/100 words</Text>

          {/* Save Changes Button */}
          <TouchableOpacity
            className="bg-[#74B318] h-12 rounded-md justify-center items-center mt-6"
            onPress={() => {
              alert("Changes saved successfully");
              handleSubmit(); // Navigate back to vendor detail after saving
            }}
          >
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    // </KeyboardAvoidingView>
  );
}
