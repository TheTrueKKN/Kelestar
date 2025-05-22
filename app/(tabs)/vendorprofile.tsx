import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import { getVendorByUser } from "../../controllers/vendorController";
import { icons } from "../../constants";
import React, { useEffect, useState, useCallback } from "react";
import ProfileSquareButton from "../../components/ProfileSquareButton";
import { useRouter, useFocusEffect, router } from "expo-router";
import { Vendor } from "../../interfaces/vendor";
import { getImage } from "../../controllers/fileController";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const vendor_profile = () => {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  useEffect(() => {
    setVendorValues();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setVendorValues();
    }, [])
  );

  const setVendorValues = async () => {
    setLoading(true);
    const result = await getVendorByUser();
    console.log(`Testing result: ${result}`);
    if (result) {
      const vendorUri = await getImage(result.vendor_image_name as string);
      const formattedVendor: Vendor = {
        id: result.id,
        vendor_name: result.vendor_name,
        vendor_description: result.vendor_description,
        vendor_image_url: vendorUri,
      };
      setVendor(formattedVendor);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Text style={{ textAlign: "center", marginTop: 32 }}>
        Loading menu...
      </Text>
    );
  }
  1;
  return (
    <View className="bg-white h-full">
      <View className="flex-row justify-between items-center mt-10 ml-3 mr-3">
        {/* Checking if valid Vendor name, if not show the default version */}
        <Text className="font-bold text-2xl">
          {vendor?.vendor_name
            ? `Hello ${vendor.vendor_name}!`
            : "Hello there!!"}
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/editvendor",
            })
          }
        >
          <Image
            className="w-5 h-5 tintColour-white"
            source={require("../../assets/icons/pen.png")} // Replace with your icon
          />
        </TouchableOpacity>
      </View>
      <Image
        source={{
          uri: vendor?.vendor_image_url || "https://via.placeholder.com/150",
        }}
        className="w-32 h-32 rounded-full border border-gray-200 shadow-sm self-center mt-4"
      />

      <TouchableOpacity
        className="self-center mt-4 flex-row items-center"
        onPress={() => setShowDescriptionModal(true)}
      >
        <Text className="text-sm text-blue-600 font-medium">
          View Vendor Description
        </Text>
      </TouchableOpacity>

      <View className="flex-row mt-6 items-center justify-center">
        <ProfileSquareButton
          title={"Leaderboard"}
          href={".././leaderboard"}
          icon={icons.badge}
        />
        <ProfileSquareButton
          title={"Footprint calculator"}
          href={".././calculator"}
          icon={icons.calculator}
        />
      </View>
      <View className="flex-row items-center justify-center space-x-6">
        <ProfileSquareButton
          title={"FAQs"}
          href={".././faq"}
          icon={icons.questionCircle}
        />
        <ProfileSquareButton
          title={"Settings"}
          href={".././settings"}
          icon={icons.settings}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDescriptionModal}
        onRequestClose={() => setShowDescriptionModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50  bg-opacity-40">
          <View className="relative bg-white rounded-2xl px-6 py-8 mx-5 max-w-[90%] w-full">
            {/* Close Icon - Top Right */}
            <TouchableOpacity
              className="absolute top-3 right-3"
              onPress={() => setShowDescriptionModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            {/* Title */}
            <Text className="text-xl font-bold text-center mb-4">
              Vendor Description
            </Text>

            {/* Description Text */}
            <Text className="text-base text-gray-700 text-center leading-relaxed">
              {vendor?.vendor_description || "We serve because we served"}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default vendor_profile;
