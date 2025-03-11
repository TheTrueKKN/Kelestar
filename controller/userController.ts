import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Alert } from "react-native";
import { Button, Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { User } from "../interfaces/user";

export async function getUserSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw error;
  }
  if (!data.session?.user) throw new Error("No user on the session!");

  return data.session;
}

export async function getUser(): Promise<User | null> {
  try {
    const session = await getUserSession();
    const { data, error, status } = await supabase
      .from("app_user")
      .select(`id, user_name, user_email, user_gender, user_role`)
      .eq("id", session.user.id)
      .single<User>();

    if (error && status !== 406) throw error;

    return data;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return null;
  }
}

export async function updateUser({
  user_name,
  user_email,
  user_role,
}: User) {
  try {
    const session = await getUserSession();
    const updates: User = {
      id: session?.user.id,
      user_name: user_name,
      user_email: user_email,
      user_role: user_role,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("app_user").upsert(updates);

    if (error) {
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
}
