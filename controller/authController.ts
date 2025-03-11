import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

export async function signUpWithEmail(
  username: string,
  email: string,
  password: string
) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        user_name: username,
        user_email: email,
      },
    },
  });

  if (error) Alert.alert(error.message);
  if (!session) {
    Alert.alert("Please check your inbox for email verification!");
    return true;
  }
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) Alert.alert(error.message);
  else return true;
}
