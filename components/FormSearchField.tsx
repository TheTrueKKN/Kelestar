import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import FormField from "./FormField";

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
  const [filteredItems, setFilteredItems] = useState<string[]>(options);
  const [searchTerm, setSearchTerm] = useState("");

  const selectItem = (item: string) => {
    setSelectedItem(item);
    setSearchTerm(item);
    handleChangeText(item);
    setIsOpen(false);
  };

  const handleSearchItem = (searchItem: string) => {
    setSearchTerm(searchItem);
    const filteredList = searchItem
      ? options.filter((option: string) =>
          option.toLowerCase().includes(searchItem.toLowerCase())
        )
      : options;
    !searchItem && setIsOpen(true);
    setFilteredItems(filteredList);
  };

  return (
    <View className={`space-y-2`}>
      <Text className="font-urbanistmedium mb-2">{title}</Text>
      <View className="relative">
        <TextInput
          className={`font-urbanistmedium border border-gray-300 rounded-md p-3`}
          value={searchTerm}
          placeholder={placeholder}
          placeholderTextColor="#8391A1"
          onChangeText={(e: string) => handleSearchItem(e)}
          onFocus={() => setIsOpen(true)}
          onEndEditing={() => setIsOpen(false)}
        ></TextInput>
        <TouchableOpacity
          onPress={() => handleSearchItem("")}
          className="absolute top-0 right-0 h-20 w-20 rounded-full z-100"
        >
          {searchTerm && (
            <Text className="text-black absolute text-lg right-0 p-2 mt-1 mr-1">
              ✕
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View className="relative">
          <ScrollView
            className="max-h-44 border-b border-gray-300"
            keyboardShouldPersistTaps="handled" // Ensures taps are handled while keyboard is open
          >
            {filteredItems.length != 0 ? (
              filteredItems.map((option: string) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => selectItem(option)}
                  className="p-3"
                >
                  <Text className="font-urbanistmedium">{option}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="p-3 font-urbanistmedium">No results found</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default FormDropDown;
