import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  interpolate,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Dish } from "../interfaces/dish";
import { getDishImage } from "../controllers/fileController";
import { Ionicons } from "@expo/vector-icons";

type DishItemProps = {
  dish: Dish;
  onEdit: (dish: Dish, dish_url?: string) => void;
  onDelete: () => void;
  setModal: () => void
};

const DishItem: React.FC<DishItemProps> = ({ dish, onEdit, onDelete, setModal }) => {
  const { dish_name, dish_price, dish_image_name, dish_total_carbon, dish_nutrition } = dish; // Destructure correctly

  const [dishUrl, setDishUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (dish_image_name) {
        const url = await getDishImage(dish_image_name);
        setDishUrl(url);
      }
    };

    fetchImage();
  }, [dish_image_name]);
  //console.log(`Data passed in: ${JSON.stringify(dish)}`)
  //console.log(`Current image URl: ${dishUrl}`)
  // --- Swipeable logic (from history.tsx) ---
  const maxTranslate = -150;
  const threshold = -40;
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = Math.min(0, ctx.startX + event.translationX);
    },
    onEnd: () => {
      if (translateX.value < threshold) {
        translateX.value = withSpring(maxTranslate);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, maxTranslate],
      [0, 1],
      "clamp"
    );
    return { opacity };
  });
  

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginVertical: 4,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Underlay buttons container positioned to the right */}
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          flexDirection: "row",
          alignItems: "center",
          paddingRight: 8,
        }}
      >
        <Animated.View style={[{ width: 48, height: "100%" }, animatedOpacity]}>
          <TouchableOpacity
            onPress={() => setModal()}
            style={{
              width: 48,
              left: 4,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#8080FF"
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>View</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[{ width: 48, height: "100%" }, animatedOpacity]}>
          <TouchableOpacity
            onPress={() => onEdit(dish, dishUrl ?? "")}
            style={{
              width: 48,
              left: 4,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#22c55e"
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[{ width: 48, height: "100%" }, animatedOpacity]}>
          <TouchableOpacity
            onPress={onDelete}
            style={{
              width: 48,
              left: 4,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#dc2626",
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {/* Swipeable card */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            animatedStyle,
            {
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#e5e7eb",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            },
          ]}
        >
          {/* Dish image on the left side */}
          {dishUrl ? (
            <Image
              source={{ uri: dishUrl }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                marginRight: 16,
                backgroundColor: "#f3f4f6",
              }}
            />
          ) : (
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                marginRight: 16,
                backgroundColor: "#f3f4f6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#9ca3af", fontStyle: "italic", fontSize: 12 }}
              >
                No image
              </Text>
            </View>
          )}

          {/* Dish name and price side by side with the image */}
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#22223b" }}
            >
              {dish_name}
            </Text>
            <Text style={{ color: "#64748b", marginTop: 2 }}>
              RM {dish_price}
            </Text>
            <Text style={{ color: "#64748b", marginTop: 2 }}>
              {dish_total_carbon?.toFixed(3)} gCO₂
            </Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default DishItem;
