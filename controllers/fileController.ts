import { supabase } from "../lib/supabase";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { decode } from "base64-arraybuffer";
import { Base64Image } from "../interfaces/base64image";

export async function getImage(fileName: string): Promise<string | null> {
  // Get the public URL of the image
  const { data } = supabase.storage
    .from("vendor")
    .getPublicUrl(`images/${fileName}`);

  if (data) {
    return data.publicUrl;
  } else {
    console.error("Error retrieving image");
    return null;
  }
}

export async function getDishImage(fileName: string): Promise<string | null> {
  // Get the public URL of the image
  const { data } = supabase.storage
    .from("dishes")
    .getPublicUrl(`dishImages/${fileName}`);

  if (data) {
    return data.publicUrl;
  } else {
    console.error("Error retrieving image");
    return null;
  }
}

export async function uploadBase64Image({
  base64,
  uri,
}: Base64Image): Promise<string | null> {
  const arrayBuffer = decode(base64);
  const contentType = getContentType(uri);

  // Generate a unique filename
  const fileName = uuidv4();

  // Upload the image to Supabase Storage
  const { data, error } = await supabase.storage
    .from("vendor")
    .upload(`images/${fileName}`, arrayBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: contentType,
      // contentType: "image/jpeg", // Adjust the content type based on the image type
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error(error.message);
  } else {
    console.log("Image uploaded successfully:", data);
    return fileName;
  }
}

export async function uploadBase64ImageDishes({
  base64,
  uri,
}: Base64Image): Promise<string | null> {
  const arrayBuffer = decode(base64);
  const contentType = getContentType(uri);

  // Generate a unique filename
  const fileName = uuidv4();

  // Upload the image to Supabase Storage
  const { data, error } = await supabase.storage
    .from("dishes")
    .upload(`dishImages/${fileName}`, arrayBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: contentType,
      // contentType: "image/jpeg", // Adjust the content type based on the image type
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error(error.message);
  } else {
    console.log("Image uploaded successfully:", data);
    return fileName;
  }
}

export async function updateBase64Image({
  fileName,
  base64,
  uri,
}: Base64Image): Promise<string | null> {
  const arrayBuffer = decode(base64);
  const contentType = getContentType(uri);

  // Upload the image to Supabase Storage
  if (!fileName) {
    throw new Error("File name is empty");
  }
  console.log(fileName);

  await supabase.storage.from("vendor").remove([`images/${fileName}`]);

  const newFileName = uuidv4();
  const { data, error } = await supabase.storage
    .from("vendor")
    .upload(`images/${newFileName}`, arrayBuffer, {
      cacheControl: "3600",
      contentType: contentType,
    });

  if (error) {
    console.error("Error updating image:", error);
    throw new Error(error.message);
  } else {
    // console.log("Image uploaded successfully:", data);
    return newFileName;
  }
}

export async function updateBase64DishImage({
  fileName,
  base64,
  uri,
}: Base64Image): Promise<string | null> {
  const arrayBuffer = decode(base64);
  const contentType = getContentType(uri);

  // Upload the image to Supabase Storage
  if (!fileName) {
    throw new Error("File name is empty");
  }
  console.log(fileName);

  await supabase.storage.from("dishes").remove([`dishImages/${fileName}`]);

  const newFileName = uuidv4();
  const { data, error } = await supabase.storage
    .from("dishes")
    .upload(`dishImages/${newFileName}`, arrayBuffer, {
      cacheControl: "3600",
      contentType: contentType,
    });

  if (error) {
    console.error("Error updating dish image:", error);
    throw new Error(error.message);
  } else {
    // console.log("Image uploaded successfully:", data);
    return newFileName;
  }
}
const getContentType = (uri: string): string => {
  const mimeTypeMatch = uri.match(/^data:(image\/\w+);/);
  let type = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";

  // Handle HEIC/HEIF explicitly
  if (type === "image/heic" || type === "image/heif") {
    type = "image/jpeg"; // Convert to JPEG or handle differently
  }

  return type;
};
