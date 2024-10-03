import { Image, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

interface Props {
  title: string;
  href: string;
  icon: any;
}

const ProfileSquareButton = ({ title, href, icon }: Props) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity className="bg-[#F8F9FA] py-4 px-4 rounded-xl w-32 h-32 m-2.5  shadow-md shadow-gray-200">
        <Image
          source={icon}
          resizeMode="contain"
          className="w-12 h-12 self-center mt-2 mb-2"
        ></Image>
        <Text className="font-psemibold text-gray-200 text-xs font-bold text-center">
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default ProfileSquareButton;
