import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

export async function signUpWithEmail(
  username: string,
  email: string,
  password: string
) {
  await signOutIfSessionExists();
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

  if (error) {
    Alert.alert(error.message);
    return false;
  }
  if (!session) {
    Alert.alert("Please check your inbox for email verification!");
    return true;
  }
}

export async function signInWithEmail(email: string, password: string) {
  await signOutIfSessionExists();
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    Alert.alert(error.message);
    return false;
  } else return true;
}

export async function signInWithOtp(
  username: string,
  email: string,
) {
  await signOutIfSessionExists();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      data: {
        user_name: username,
        user_email: email,
      },
    },
  });

  if (error) {
    Alert.alert(error.message);
    return false;
  } else {
    Alert.alert("Please check your inbox for email verification!");
    return true
  };
}

export async function verifyEmailOtp(  email: string, token: string){
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });
  if (error) {
    Alert.alert(error.message);
    return false;
  } else return true;
}

export async function signOutIfSessionExists() {
  const { data, error } = await supabase.auth.getSession();
  if (data.session?.user) {
    await signOut();
  }
  if (error) {
    Alert.alert(error.message);
    return false;
  } else return true;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    Alert.alert(error.message);
    return false;
  } else return true;
}
