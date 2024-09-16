import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-blue">
      <Text className="text-3xl font-pblack">Hey Lohan</Text>
      <StatusBar style="auto" />
      <Link href={"/register"} style={{color: 'blue'}}>
        Go to Register Page
      </Link>
    </View>
  );
}

