import {View, Image } from "react-native";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-blue">
        <Image
            source={require("./assets/logo.png")}
            className="w-24 h-24"
        />
        </View>
    );
    }