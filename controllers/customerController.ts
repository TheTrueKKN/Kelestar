import { Alert } from "react-native";
import { Customer } from "../interfaces/customer";
import { supabase } from "../lib/supabase";
import { getUserSession } from "./userController";

export async function getCustomerByUser() {
  try {
    const session = await getUserSession();
    const { data, error, status } = await supabase
      .from("customer")
      .select(`*`)
      .eq("customer_user_id", session.user.id)
      .single<Customer>();

    if (error && status !== 406) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return null;
  }
}

export async function insertCustomer() {
  try {
    const session = await getUserSession();
    const customer: Customer = {
      customer_user_id: session?.user.id,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("customer").insert(customer);
    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return false;
    }
  }
}

export async function updateCustomer({ customer_carbon_budget }: Customer) {
  try {
    const currentCustomer = await getCustomerByUser();
    const customer: Customer = {
      customer_carbon_budget: customer_carbon_budget,
      updated_at: new Date(),
    };

    const { error } = await supabase
      .from("customer")
      .update(customer)
      .eq("id", currentCustomer?.id);
    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return false;
    }
  }
}
