import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  RouteParams,
  useGlobalSearchParams,
  useRouter,
  useFocusEffect,
} from "expo-router";
import { useCallback } from "react";
import DishItem from "../../components/DishItem";
import { getVendorByUser } from "../../controllers/vendorController";
import { Dish } from "../../interfaces/dish";
import { getDishes } from "../../controllers/dishController";

export default function Menu() {

  const [vendorId, setVendorId] = useState("");
   const [vendorName, setVendorName] = useState(""); // Vendor name state
   const [vendorDesc, setVendorDescription] = useState(""); // Vendor description state
   const [vendorUri, setUri] = useState(""); // Thumbnail image state
   const [vendorDishes, setVendorDishes] = useState<Dish[]>([]);
   // Getting parameters from Initial menu page
  const { menudDishes, newDish } =
    useGlobalSearchParams();

    useEffect(() => {
        const setVendorValues = async () => {
          const result = await getVendorByUser();
          if (result) {
            setVendorId(result.id!)
            setVendorName(result.vendor_name);
            setVendorDescription(result.vendor_description);
            if (result.vendor_image_url) {
              setUri(result.vendor_image_url);
              // console.log("thumbnailimage", editUri);
            }
          }
        };
        const setDishMenu = async () => {
          const menu_result = await getDishes(vendorId)
          if(menu_result){
            setVendorDishes(menu_result)
          }
        }
        setVendorValues();
        setDishMenu();

        console.log(`Curren dishes: ${JSON.stringify(vendorDishes)}`)
      }, []);

  // Getting parameters from the editvendor Page
  const { newVendorName, newVendorDesc, newImg } = useGlobalSearchParams();
  const router = useRouter();

  const [validVendorName, setValidVendorName] = useState<string | undefined>(
    undefined
  );
  const [validVendorDesc, setValidVendorDesc] = useState<string | undefined>(
    undefined
  );
  const [validVendorUri, setValidVendorUri] = useState<string | undefined>(
    undefined
  );
  

  // Parsing the menu dishes item
  const parsedDishes = menudDishes
    ? JSON.parse(Array.isArray(menudDishes) ? menudDishes[0] : menudDishes)
    : [];
  const [dishes, setDishes] = useState<Dish[]>(parsedDishes);

  // Helper function to validate and extract single value
  const validateParam = (
    param: string | string[] | undefined
  ): string | undefined => {
    return Array.isArray(param) ? param[0] : param;
  };

  // Function to add dishes into the array
  const addNewDish = (newDish: Dish) => {
    if (!dishes.some((dish) => dish.id === newDish.id)) {
      setDishes((prevDishes) => [...prevDishes, newDish]);
    }
  };

  // Function to delete a dish
  const deleteDish = (id: string) => {
    setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== id));
  };

  // Function to edit a dish (Not functionable yet just redirect to different page)
  const editDish = (dish: RouteParams<string> | undefined) => {
    router.push({
      pathname: "/editdish",
      params: { ...dish },
    });
  };

  // Update vendor details when the screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log("WASSSUPPPPPPPPPPPPPP")
      setValidVendorName(validateParam(newVendorName || vendorName));
      setValidVendorDesc(validateParam(newVendorDesc || vendorDesc));
      setValidVendorUri(validateParam(newImg || vendorUri));

      if (newDish) {
        const parsedDish =
          typeof newDish === "string" ? JSON.parse(newDish) : null;
        if (parsedDish) {
          addNewDish(parsedDish);
        }
      }
    }, [
      vendorName,
      vendorDesc,
      vendorUri,
      newVendorName,
      newVendorDesc,
      newImg,
      newDish,
    ])
  );

  return (
    <View className="bg-white flex-1">
      {/* Top Header with icon on the right */}
      <View className="flex-row justify-between items-center mt-5 ml-3 mr-3">
        {/* Checking if valid Vendor name, if not show the default version */}
        <Text className="font-bold text-2xl">
          {validVendorName ? `Hello ${validVendorName}!` : "Hello there!!"}
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/editvendor",
              params: { prevPage: "/menu" },
            })
          }
        >
          <Image
            className="w-5 h-5 tintColour-white"
            source={require("../../assets/icons/pen.png")} // Replace with your icon
          />
        </TouchableOpacity>
      </View>

      {/* Same goes for the thumbnail image */}
      <View className="space-y-2 justify-center items-center">
        <Image
          source={{ uri: validVendorUri || "https://via.placeholder.com/150" }}
          className="w-40 h-40 mt-10"
        />
      </View>

      {/* Display the previously given vendor description, if not valud then display a default version */}
      <Text className="font-bold text-center px-5 mt-4">
        {validVendorDesc || "Happy to serve you"}
      </Text>

      {/* Create new dish button */}
      <View className="px-4 mt-6">
        <TouchableOpacity
          className="bg-[#74B318] py-3 rounded-md justify-center items-center"
          onPress={() =>
            router.push({
              pathname: "/createdish",
              params: { prevPage: "/menu" },
            })
          }
        >
          <Text className="text-white text-lg font-bold">
            Create new dish +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dish list */}
      <ScrollView className="h-60 mt-5" showsVerticalScrollIndicator={false}>
        {vendorDishes.length === 0 ? (
          <Text className="text-gray-400 text-center mt-4">
            No dishes added yet.
          </Text>
        ) : (
          vendorDishes.map((dish) => (
            <DishItem
              key={dish.id}
              dish={dish}
              onDelete={() => deleteDish(dish.id as string)}
              onEdit={() => {}}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
