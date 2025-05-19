
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');

  const router = useRouter()

  const handleSubmit = () => {
    if (!feedback.trim()) {
      Alert.alert("Empty Feedback", "Please write something before submitting.");
      return;
    }
    // handle sending feedback to your backend here
    Alert.alert("Thank you!", "Your feedback has been submitted.");
    router.back()
    setFeedback('');
  };

  return (
    <View className="flex-1 bg-white pt-10 px-6">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with back icon */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="#006400" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-[#006400]">Feedback</Text>
      </View>

      <Text className="text-2xl font-bold text-center mb-4 text-gray-800">
        We value your feedback!
      </Text>

      <Text className="text-sm text-gray-600 text-center mb-6">
        Let us know your thoughts or any suggestions you have.
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-4 h-40 text-base text-gray-800"
        placeholder="Write your feedback here..."
        placeholderTextColor="#999"
        multiline={true}
        textAlignVertical="top"
        value={feedback}
        onChangeText={setFeedback}
      />

    <TouchableOpacity
      className="mt-6 bg-[#74B318] py-3 rounded-md items-center flex-row justify-center space-x-2"
      onPress={handleSubmit}
    >
        <Text className="text-white font-semibold text-base">Submit Feedback</Text>
        <Ionicons name="trash-outline" size={20} color="white" />
    </TouchableOpacity>
    </View>
  );
};

export default FeedbackPage;
