import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Types for FAQ items
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

// Types for category
interface Category {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}

const KnowledgeBase = () => {
  // State for search input
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  
  // Categories data
  const categories: Category[] = [
    {
      id: "1",
      title: "Questions about",
      subtitle: "Getting Started",
      color: "#E6F0FF",
      icon: "help-circle-outline"
    },
    {
      id: "2",
      title: "Questions about",
      subtitle: "creating menu",
      color: "#E6FFEE",
      icon: "leaf-outline"
    },
    {
      id: "3",
      title: "Questions about",
      subtitle: "calculations",
      color: "#FFE6E6",
      icon: "calculator-outline"
    }
  ];
  
  // FAQ data
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: "1",
      question: "How do we calculate carbon footprint?",
      answer: "We use a method called life cycle assessment using data collected from state-of-the-art research. Each ingredient... bla bla bla",
      expanded: true
    },
    {
      id: "2",
      question: "What is life cycle assessment?",
      answer: "Life cycle assessment is a methodology... bla bla bla",
      expanded: false
    },
    {
      id: "3",
      question: "What is carbon label?",
      answer: "Carbon label discloses carbon footprint...bla bla bla",
      expanded: false
    },
    {
      id: "4",
      question: "What are the benefits of plant-based diet?",
      answer: "Plant-based diets offer numerous environmental and health benefits...bla bla bla",
      expanded: false
    }
  ]);
  
  // Toggle FAQ expansion
  const toggleExpand = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };
  
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="px-6 pt-12 pb-6 bg-white shadow-sm">
            <View className="flex-row items-center mb-3">
              <TouchableOpacity onPress={() => router.back()}  className="mr-3">
                <Ionicons name="chevron-back" size={24} color="#006400" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-[#006400]">
                Knowledge Base
              </Text>
              <View className="flex-1" />
              {/* <TouchableOpacity>
                <Ionicons name="search" size={24} color="#006400" />
              </TouchableOpacity> */}
            </View>
          </View>
          
          {/* Search Bar */}
          {/* <View className="px-6 py-2">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
              <Ionicons name="search" size={20} color="#999999" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Enter your keyword"
                className="flex-1 ml-2 text-base text-gray-700"
              />
            </View>
          </View> */}
          
          {/* Categories */}
          {/* <View className="px-6 py-4">
            <View className="flex-row justify-between">
              {categories.map((category) => (
                <TouchableOpacity 
                  key={category.id}
                  className={`px-2 py-3 rounded-lg w-[30%]`}
                  style={{ backgroundColor: category.color }}
                >
                  <View className="items-center">
                    <Ionicons name={category.icon as any} size={24} color="#006400" />
                    <Text className="text-xs text-gray-600 mt-1 text-center">{category.title}</Text>
                    <Text className="font-semibold text-center text-[#006400]">{category.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View> */}
          
          {/* Top Questions */}
          <View className="px-6 py-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-[#333333]">Top Questions</Text>
              {/* <TouchableOpacity>
                <Text className="text-sm text-[#74B318]">View all</Text>
              </TouchableOpacity> */}
            </View>
            
            {/* FAQ Items */}
            {faqs.map((faq) => (
              <TouchableOpacity 
                key={faq.id}
                className="bg-gray-50 rounded-lg p-4 mb-3"
                onPress={() => toggleExpand(faq.id)}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-base font-medium text-[#333333] flex-1 pr-2">{faq.question}</Text>
                  <Ionicons
                    name={faq.expanded ? "remove-outline" : "add-outline"} 
                    size={20} 
                    color={faq.expanded ? "#74B318" : "#999999"} 
                  />
                </View>
                {faq.expanded && (
                  <Text className="text-sm text-gray-600 mt-2">{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default KnowledgeBase;