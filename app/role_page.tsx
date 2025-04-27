import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import RoleSelection from '../components/RoleSelection'


const role_page = () => {
    return (
      <SafeAreaView className = "bg-custom_green h-full">
        <ScrollView>
          <View className="w-full justify-center h-full my-6">
            <Text className="text-2xl text-black text-semibold font-psemibold ml-4">
              Select your Role
            </Text>
  
            <RoleSelection/>
          </View>
        </ScrollView>
        
  
      </SafeAreaView>
    )
  }
  
  export default role_page
  