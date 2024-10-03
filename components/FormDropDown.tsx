import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

interface Props {
  title: string;
  value: string;
  options: string[];
  placeholder?: string;
  handleChangeText: (e: string) => void;
}

const FormDropDown = ({
  title,
  value,
  options,
  placeholder,
  handleChangeText,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown open/close state
  const [selectedItem, setSelectedItem] = useState(""); // Selected item state

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectItem = (item: string) => {
    setSelectedItem(item);
    handleChangeText(item);
    setIsOpen(false);
  };

  return (
    <View className={`space-y-2`}>
      <Text className="font-urbanistmedium mb-2">{title}</Text>
      <TouchableOpacity
        onPress={toggleDropdown}
        className="p-4 rounded-md flex-row justify-between items-center border border-gray-300"
      >
        <Text
          className={`${
            selectedItem ? "black" : "text-gray-500"
          }  font-urbanistmedium`}
        >
          {selectedItem ? selectedItem : placeholder}
        </Text>
        <Text className="text-gray-300 font-urbanistmedium">
          {isOpen ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View className="relative">
          <ScrollView className="max-h-44 border-b border-gray-300">
            {options ? (
              options.map((option: string) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => selectItem(option)}
                  className="p-3"
                >
                  <Text className="font-urbanistmedium">{option}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                key={0}
                onPress={() => selectItem("0")}
                className="p-3"
              >
                <Text className="font-urbanistmedium">No results found</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default FormDropDown;
