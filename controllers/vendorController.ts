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

export async function updateVendorGreenScore(vendorId: string) {
  try {
    const best_case_footprint = 0.5;
    const worst_case_footprint = 10;

    // Fetch all dishes for the vendor
    const { data: dishes, error } = await supabase
      .from("dish")
      .select("dish_total_carbon")
      .eq("dish_vendor_id", vendorId);

    if (error) throw error;

    if (!dishes || dishes.length === 0) {
      // No dishes found — set green score to 0
      await supabase
        .from("vendors")
        .update({ green_score: 0 })
        .eq("id", vendorId);
      return;
    }

    // Compute average footprint
    const totalCarbon = dishes.reduce((sum, dish) => sum + (dish.dish_total_carbon || 0), 0);
    const avgFootprint = totalCarbon / dishes.length;

    // Normalize to a 0–100 score
    let normalizedScore =
      ((worst_case_footprint - avgFootprint) / (worst_case_footprint - best_case_footprint)) * 100;
    normalizedScore = Math.max(0, Math.min(100, normalizedScore));

    //  Update vendor with the score
    await supabase
      .from("vendor")
      .update({ vendor_green_score: Number(normalizedScore.toFixed(2)) })
      .eq("id", vendorId);

    // console.log(`Updated green score for vendor ${vendorId}: ${normalizedScore.toFixed(2)}`);
  } catch (err) {
    console.error(" Failed to update vendor green score:", err);
  }
}

export async function getVendorRank(
  vendorId: string
){
  const {data:vendors, error } = await supabase
  .from('vendor')
  .select("id, vendor_green_score")

  if(error || !vendors){
    console.error("Failed to fetch vendors:", error)
    return null;
  }

  const sortedVendors = vendors.sort((a,b) => b.vendor_green_score - a.vendor_green_score);

  const rank = sortedVendors.findIndex(v =>v.id === vendorId);

  if(rank === -1){
    return null;
  }

  return rank + 1
}
