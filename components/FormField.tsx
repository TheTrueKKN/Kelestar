import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import CustomButton from "./CustomButton";

interface Props {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles: string;
  keyboardType: string;
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="font-urbanistmedium mb-2">{title}</Text>
      <View className="relative">
        <TextInput
          className="font-urbanistmedium border border-gray-300 rounded-md p-3 mb-2"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#8391A1"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !passwordVisible}
        />

        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-0 p-2 mt-2"
          >
            <Image
              source={passwordVisible ? icons.eyeHide : icons.eye}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
