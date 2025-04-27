import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons

// FAQ item type
type FAQItemProps = {
  question: string;
  answer: string;
};

// Individual FAQ item component
const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="bg-emerald-50 rounded-xl mb-4 overflow-hidden border-l-4 border-l-emerald-500">
      <TouchableOpacity 
        className="flex-row justify-between items-center p-4"
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text className="text-base font-semibold text-gray-800 flex-1 pr-2">{question}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={22} 
          color="#10B981" 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View className="p-4 pt-0 bg-white border-t border-t-gray-200">
          <Text className="text-[15px] leading-6 text-gray-700">{answer}</Text>
        </View>
      )}
    </View>
  );
};

const FAQ = () => {
  // FAQ data
  const faqData: FAQItemProps[] = [
    {
      question: "What is Kelestar?",
      answer: "Kelestar is a platform designed to help university students monitor the carbon footprint of their food choices at campus canteens. Each dish is assigned a carbon emission rating (A, B, C) based on its ingredients, preparation methods, and overall environmental impact. Our goal is to promote sustainable eating habits and environmental awareness within the university community."
    },
    {
      question: "How is the carbon footprint of dishes calculated?",
      answer: "We calculate a dish's carbon footprint by analyzing multiple factors including: ingredient sourcing (local vs. imported), production methods, transportation, processing requirements, and cooking energy consumption. Our algorithm combines this data to generate a comprehensive CO₂e (carbon dioxide equivalent) measurement, which is then translated into our simplified A-C grading system for easy understanding."
    },
    {
      question: "What do the A, B, and C grades mean?",
      answer: "Grade A (Green): Low carbon footprint dishes with minimal environmental impact. These typically include plant-based options with locally-sourced ingredients.\n\nGrade B (Yellow): Moderate carbon footprint dishes. These may include some animal products but in limited quantities or dishes with some imported ingredients.\n\nGrade C (Red): Higher carbon footprint dishes. These typically include red meat, dairy-heavy meals, or dishes with multiple imported ingredients."
    },
    {
      question: "How do I create an account and log in?",
      answer: "Creating an account is simple! Click the 'Sign Up' button on the login screen and enter your university email address. You'll be asked to create a password and complete a brief profile. Once registered, you can log in anytime using your email and password. Your history and preferences will be saved to your account, allowing you to track your progress over time."
    },
    {
      question: "Can I see my carbon emission history?",
      answer: "Yes! The History page shows your meal choices organized by date, complete with their carbon ratings. You can view daily, weekly, or monthly summaries of your carbon footprint. This feature helps you visualize your environmental impact over time and identify patterns in your eating habits."
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-emerald-700 mb-2">Frequently Asked Questions</Text>
        <Text className="text-base text-gray-500 mb-6">
          Find answers to common questions about our carbon tracking platform
        </Text>
        
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {faqData.map((item, index) => (
            <FAQItem 
              key={index} 
              question={item.question} 
              answer={item.answer} 
            />
          ))}
          
          <View className="bg-emerald-50 rounded-xl p-4 my-4">
            <Text className="text-lg font-semibold text-emerald-700 mb-2">Still have questions?</Text>
            <Text className="text-[15px] text-gray-700 leading-6">
              Contact us at support@carbontrack.edu or visit the Sustainability Office in the Student Union Building.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FAQ;