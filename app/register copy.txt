// import {
//   Alert,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Image,
// } from "react-native";
// import React, { useState } from "react";
// import { icons } from "../constants";
// import { Link, useRouter } from "expo-router";
// import CustomButton from "../components/CustomButton";
// import { supabase } from "../lib/supabase";
// import { updateUser } from "../controllers/userController";
// import { signInWithEmail, signInWithOtp, signUpWithEmail } from "../controllers/authController";
// import { ScrollView } from "react-native";

// export default function App() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();

//   const handleRegister = async () => {
//     setLoading(true);
//     if (!username || !email || !password || !confirmPassword) {
//       Alert.alert("Please fill in all fields");
//     } else if (password !== confirmPassword) {
//       Alert.alert("Passwords do not match");
//     } else if (await signInWithOtp(username, email, password)) {
//         // Alert.alert("Register successful");
//         const userDetails = {
//           username: username,
//           email: email
//         };
//         router.push({ pathname: "/userverification", params: userDetails });
//     }
//     setLoading(false);
//   };

//   return (
//     <View className="flex-1 justify-center px-8 bg-white">
//           <ScrollView>
//       <Text className="text-3xl font-urbanistbold text mb-4">
//         Welcome to join the sustainable community
//       </Text>

//       <Text className="font-urbanistmedium mb-2">Username</Text>
//       <TextInput
//         className="font-urbanistmedium border border-gray-300 rounded-md p-3 mb-2"
//         placeholder="Enter your username"
//         value={username}
//         onChangeText={setUsername}
//       />

//       <Text className="font-urbanistmedium mb-2">Email</Text>
//       <TextInput
//         className="font-urbanistmedium border border-gray-300 rounded-md p-3 mb-2"
//         placeholder="Enter your email"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <Text className="font-urbanistmedium mb-2">Password</Text>
//       <View className="relative">
//         <TextInput
//           className="font-urbanistmedium border border-gray-300 rounded-md p-3 mb-2"
//           placeholder="Enter your password"
//           secureTextEntry={!passwordVisible}
//           value={password}
//           onChangeText={setPassword}
//         />
//         <TouchableOpacity
//           onPress={() => setPasswordVisible(!passwordVisible)}
//           className="absolute right-0 p-2 mt-2"
//         >
//           <Image
//             source={passwordVisible ? icons.eyeHide : icons.eye}
//             className="w-6 h-6"
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       </View>

//       <Text className="font-urbanistmedium mb-2">Confirm Password</Text>
//       <View className="relative">
//         <TextInput
//           className="font-urbanistmedium border border-gray-300 rounded-md p-3 mb-2"
//           placeholder="Confirm your password"
//           secureTextEntry={!confirmPasswordVisible}
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//         />
//         <TouchableOpacity
//           onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
//           className="absolute right-0 p-2 mt-2"
//         >
//           <Image
//             source={confirmPasswordVisible ? icons.eyeHide : icons.eye}
//             className="w-6 h-6"
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* <TouchableOpacity
//         className="bg-green text-white rounded-xl p-3 mt-4"
//         onPress={handleRegister}
//         activeOpacity={0.7}
//       >
//         <Text className="text-lg text-white font-psemibold text-center">
//           Register
//         </Text>
//       </TouchableOpacity> */}

//       <CustomButton
//         title="Register"
//         handlePress={handleRegister}
//         containerStyles="mt-7"
//         isLoading={loading}
//       />

//       <View className="flex-row justify-center mt-2.5">
//         <Text className="font-urbanistmedium">Already have an account? </Text>
//         {/* <TouchableOpacity
//           activeOpacity={0.3}
//           onPress={() => Alert.alert("Navigate to Login")}
//         > */}
//         {/* <Text className="font-urbanistmedium text-green">Log in</Text> */}
//         <Link href={"/login"} className="font-urbanistmedium text-green">
//           Log in
//         </Link>
//         {/* </TouchableOpacity> */}
//       </View>
//       </ScrollView>
//     </View>

//   );
// }
