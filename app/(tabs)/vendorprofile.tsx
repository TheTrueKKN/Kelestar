import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import React from "react";
import ProfileSquareButton from "../../components/ProfileSquareButton";

const vendorLogo = require("../../assets/images/vendor_logo.png");

const vendor_profile = () => {
  return (
    <View className="bg-white h-full">
      <Image source={vendorLogo} className="w-32 h-32 self-center mt-2" />
      <View className="flex-row mt-6 items-center justify-center">
        <ProfileSquareButton
          title={"Leaderboard"}
          href={".././leaderboard"}
          icon={icons.badge}
        ></ProfileSquareButton>
        <ProfileSquareButton
          title={"Footprint calculator"}
          href={".././calculator"}
          icon={icons.calculator}
        ></ProfileSquareButton>
      </View>
      <View className="flex-row items-center justify-center">
        <ProfileSquareButton
          title={"FAQs"}
          href={".././faq"}
          icon={icons.questionCircle}
        ></ProfileSquareButton>
        <ProfileSquareButton
          title={"Settings"}
          href={".././settings"}
          icon={icons.settings}
        ></ProfileSquareButton>
      </View>
    </View>
  );
};

export default vendor_profile;
