import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  InputModeOptions,
  KeyboardTypeIOS,
  KeyboardTypeOptions,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import CustomButton from "./CustomButton";

interface Props {
  title?: string;
  value?: any;
  placeholder?: string;
  handleChangeText?: (e: any) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  inputMode?: InputModeOptions;
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  inputMode,
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <View className={`space-y-1 ${otherStyles}`}>
      {title && <Text className="font-urbanistmedium mb-2">{title}</Text>}
      <View className="relative">
        <TextInput
          className="font-urbanistmedium border border-gray-300 rounded-md p-3 mb-2"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#8391A1"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !passwordVisible}
          keyboardType={keyboardType}
          inputMode={inputMode}
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
