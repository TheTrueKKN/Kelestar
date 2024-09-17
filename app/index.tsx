import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import role_page from "./role_page";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import register from "./register";


const Stack = createNativeStackNavigator()
export default function App() {
  return (

    <>
    <View className="flex-1 items-center justify-center bg-blue">
        <Text className="text-3xl font-pblack">Hey Lohan</Text>
        <StatusBar style="auto" />
        <Link href={"/register"} style={{ color: 'blue' }}>
          Go to Register Page
        </Link>
      </View></>

    
  );
}

