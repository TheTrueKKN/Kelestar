import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { getVendorByUser } from "../../controllers/vendorController";
import { icons } from "../../constants";
import ProfileSquareButton from "../../components/ProfileSquareButton";

const VendorProfile = () => {
  const [vendorName, setVendorName] = useState("");
  const [vendorUri, setVendorUri] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      const result = await getVendorByUser();
      if (result) {
        setVendorName(result.vendor_name || "");
        setVendorUri(result.vendor_image_url || "");
      }
    };
    fetchVendor();
  }, []);

  return (
    <View className="bg-white h-full px-6 pt-8">
      <Image
        source={{ uri: vendorUri || "https://via.placeholder.com/150" }}
        style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 18, borderRadius: 32, backgroundColor: '#f3f4f6', borderWidth: 2, borderColor: '#e5e7eb' }}
      />

      <Text className="text-2xl font-pbold text-primary text-center mb-8">
        {vendorName || "Vendor Profile"}
      </Text>

      <View className="flex-row items-center justify-center mb-6 space-x-6">
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
    </View>
  );
};

export default VendorProfile;
