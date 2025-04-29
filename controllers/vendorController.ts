import { Alert } from "react-native";
import { Vendor } from "../interfaces/vendor";
import { supabase } from "../lib/supabase";
import { getUserSession } from "./userController";
import {
  getImage,
  updateBase64Image,
  uploadBase64Image,
} from "./fileController";
import { Base64Image } from "../interfaces/base64image";

export async function getVendors() {
  try {
    const { data, error, status } = await supabase.from("vendor").select("*");

    if (error && status !== 406) throw error;
    // console.log(`Data: ${JSON.stringify(data)}, error: ${JSON.stringify(error)}, status: ${JSON.stringify(status)}`)
    return data as Vendor[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getVendorByUser() {
  try {
    const session = await getUserSession();
    const { data, error, status } = await supabase
      .from("vendor")
      .select(
        `id, vendor_name, vendor_description, vendor_image_name, vendor_user_id`
      )
      .eq("vendor_user_id", session.user.id)
      .single<Vendor>();

    if (data && data.vendor_image_name) {
      data.vendor_image_url = await getImage(data?.vendor_image_name);
    }

    if (error && status !== 406) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return null;
  }
}

export async function insertVendor(
  { vendor_name, vendor_description }: Vendor,
  { base64, uri }: Base64Image
) {
  try {
    const session = await getUserSession();

    const vendor: Vendor = {
      vendor_user_id: session?.user.id,
      vendor_name: vendor_name,
      vendor_description: vendor_description,
      updated_at: new Date(),
    };

    if (base64) {
      const vendor_image_name = await uploadBase64Image({
        base64: base64,
        uri: uri,
      });
      if (vendor_image_name != null) {
        vendor.vendor_image_name = vendor_image_name;
      }
    } else {
      throw new Error("Please provide a vendor photo");
    }

    const { error } = await supabase.from("vendor").insert(vendor);

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

export async function updateVendor(
  { vendor_name, vendor_description }: Vendor,
  { base64, uri }: Base64Image
) {
  try {
    const currentVendor = await getVendorByUser();
    const vendor: Vendor = {
      vendor_name: vendor_name,
      vendor_description: vendor_description,
      updated_at: new Date(),
    };

    if (base64 && currentVendor?.vendor_image_name) {
      const vendor_image_name = await updateBase64Image({
        fileName: currentVendor?.vendor_image_name,
        base64: base64,
        uri: uri,
      });
      if (vendor_image_name != null) {
        vendor.vendor_image_name = vendor_image_name;
      }
    }

    const { error } = await supabase
      .from("vendor")
      .update(vendor)
      .eq("id", currentVendor?.id);

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
