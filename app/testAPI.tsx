import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { generateNutritionInfo } from '../components/GeminiAI';

export default function TestApi() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const result = await generateNutritionInfo(prompt);
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse('Error: ' + error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Ask Gemini..."
        value={prompt}
        onChangeText={setPrompt}
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Text>{response}</Text>
    </View>
  );
}