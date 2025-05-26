import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Image, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { getVendorByUser, updateVendorGreenScore } from '../../controllers/vendorController';
import { getDishes, deleteDish } from '../../controllers/dishController';
import { Dish } from '../../interfaces/dish';
import { getCarbonRating, getRatingBadgeColor } from '../../lib/utils/carbonRating';
import { joinDishIngredient } from '../../controllers/dishIngredientJoinController';
import { JoinedDishIngredient } from '../../interfaces/joinedDishIngredient';

export default function Menu() {
  const router = useRouter();
  const [vendorId, setVendorId] = useState<string>('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState<boolean>(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState<boolean>(false);
  const [dishDetailsVisible, setDishDetailsVisible] = useState<boolean>(false);
  const [dishIngredients, setDishIngredients] = useState<JoinedDishIngredient[]>([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);

  // fetch vendor
  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      const v = await getVendorByUser();
      if (v?.id) setVendorId(v.id);
      setLoading(false);
    };
    fetchVendor();
  }, []);

  // load dishes
  const loadDishes = async () => {
    if (!vendorId) return;
    const res = await getDishes({ dish_vendor_id: vendorId, active: true });
    if (res) setDishes(res);
  };
  useFocusEffect(
    useCallback(() => {
      loadDishes();
    }, [vendorId])
  );

  const onPressDish = (dish: Dish) => {
    setSelectedDish(dish);
    setActionSheetVisible(true);
  };

  const closeActionSheet = () => {
    setActionSheetVisible(false);
  };

  const handleView = () => {
    // First close the action sheet
    setActionSheetVisible(false);
    // Then show the dish details and load ingredients
    loadDishIngredients();
    setDishDetailsVisible(true);
  };

  const loadDishIngredients = async () => {
    if (!selectedDish?.id) return;
    
    setIngredientsLoading(true);
    try {
      const fetchedIngredients = await joinDishIngredient(selectedDish.id);
      if (fetchedIngredients && Array.isArray(fetchedIngredients)) {
        setDishIngredients(fetchedIngredients);
      }
    } catch (error) {
      console.error("Failed to load ingredients:", error);
    } finally {
      setIngredientsLoading(false);
    }
  };

  const closeDishDetails = () => {
    setDishDetailsVisible(false);
    setDishIngredients([]);
    setSelectedDish(null); // Only reset the selected dish when closing the details modal
  };

  const handleEdit = () => {
    if (!selectedDish) return;
    closeActionSheet();
    const { dish_vendor, dish_nutrition, dish_ingredient, active, ...rest } = selectedDish;
    router.push({ pathname: '/editdish', params: { ...rest, prev_page: '/menu' } });
  };

  const promptDelete = () => {
    // Show confirmation
    setActionSheetVisible(false);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedDish) {
      await deleteDish(selectedDish);
      await updateVendorGreenScore(vendorId);
      setDishes(dishes.filter(d => d.id !== selectedDish.id));
    }
    setConfirmDeleteVisible(false);
    setSelectedDish(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteVisible(false);
    setSelectedDish(null);
  };

  const renderDish = ({ item }: { item: Dish }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white shadow-lg rounded-xl mx-4 my-2 p-4 h-28"
      onPress={() => onPressDish(item)}
    >
      <Image
        source={{ uri: item.dish_image_url || 'https://via.placeholder.com/150' }}
        className="w-20 h-20 rounded-lg mr-4"
      />
      <View className="flex-1 justify-center">
        <Text className="text-lg font-semibold text-gray-800">{item.dish_name}</Text>
        <Text className="text-sm text-gray-600 mt-1">RM{item.dish_price?.toFixed(2) ?? '0.00'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#4B5563" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Stylish Header */}
      <View className="pt-6 pb-6 px-6 bg-green rounded-b-3xl shadow-md flex-row justify-between items-center">
        <Text className="text-4xl font-pbold text-white">Your Menu</Text>
        <TouchableOpacity className="p-2 bg-none rounded-full" onPress={() => router.push({ pathname: '/createdish', params: { vendorId, prev_page: '/menu' } })}>
          <Ionicons name="add-circle-sharp" size={34} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={dishes}
          keyExtractor={(d, i) => d.id ?? i.toString()}
          renderItem={renderDish}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Action Sheet */}
      <Modal transparent animationType="slide" visible={actionSheetVisible} onRequestClose={closeActionSheet}>
        <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={closeActionSheet} />
        <View className="bg-white p-4 rounded-t-2xl border-t border-gray-200">
          <View className="mb-4 items-center">
            <Text className="text-lg font-medium text-gray-800">{selectedDish?.dish_name}</Text>
          </View>
          <TouchableOpacity className="py-3 border-t border-gray-100" onPress={handleView}>
            <Text className="text-base text-gray-700">View Dish</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-3 border-t border-gray-100" onPress={handleEdit}>
            <Text className="text-base text-gray-700">Edit Dish</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-3 border-t border-gray-100" onPress={promptDelete}>
            <Text className="text-base text-red-600">Delete Dish</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-3 mt-2" onPress={closeActionSheet}>
            <Text className="text-base text-gray-500 text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete Confirmation Modal with blurred backdrop */}
      <Modal transparent animationType="fade" visible={confirmDeleteVisible} onRequestClose={cancelDelete}>
      {/* Background Blur covering entire screen */}
      <BlurView
        intensity={90}
        tint="dark"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
              Confirm Deletion
            </Text>
            <View className="h-px bg-gray-200 my-2" />
            <Text className="text-base text-gray-600 mb-6 text-center">
              Are you sure you want to permanently delete
              {'\n'}"{selectedDish?.dish_name}"?
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={cancelDelete}
                className="flex-1 bg-gray-100 rounded-lg py-2"
              >
                <Text className="text-center text-gray-800 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                className="flex-1 bg-red-600 rounded-lg py-2"
              >
                <Text className="text-center text-white font-medium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Dish Details Modal */}
      <Modal
        visible={dishDetailsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDishDetails}
      >
        <BlurView
          intensity={90}
          tint="dark"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View className="flex-1 bg-black/60 justify-center items-center px-5">
          <View className="bg-white w-full rounded-2xl p-5 shadow-xl">
            {/* Header with close button */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-pbold text-primary">{selectedDish?.dish_name}</Text>
              <TouchableOpacity 
                onPress={closeDishDetails}
                className="p-1 rounded-full bg-gray-100"
              >
                <Ionicons name="close" size={18} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Dish Image */}
            {selectedDish?.dish_image_url && (
              <Image
                source={{ uri: selectedDish.dish_image_url }}
                className="h-32 w-full rounded-lg mb-4"
                resizeMode="cover"
              />
            )}

            {/* Rating Badge and Carbon */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-medium">
                Carbon: <Text className="text-primary font-bold">{selectedDish?.dish_total_carbon?.toFixed(2)} kg CO₂e</Text>
              </Text>
              {selectedDish && (
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: getRatingBadgeColor(getCarbonRating(selectedDish.dish_total_carbon ?? 0)) }}
                >
                  <Text className="text-white font-pbold text-lg">
                    {getCarbonRating(selectedDish.dish_total_carbon ?? 0)}
                  </Text>
                </View>
              )}
            </View>
            
            {/* Nutritional Info if available */}
            {selectedDish?.dish_nutrition && (
              <View className="mb-4">
                <Text className="text-base font-pbold text-gray-700 mb-2">Nutrition Facts:</Text>
                <View className="flex-row flex-wrap justify-between border-t border-b border-gray-200 py-2">
                  <View className="w-1/2 p-1">
                    <Text className="text-gray-700">Calories: {selectedDish.dish_nutrition.calories} kcal</Text>
                  </View>
                  <View className="w-1/2 p-1">
                    <Text className="text-gray-700">Protein: {selectedDish.dish_nutrition.protein}g</Text>
                  </View>
                  <View className="w-1/2 p-1">
                    <Text className="text-gray-700">Carbs: {selectedDish.dish_nutrition.carbs}g</Text>
                  </View>
                  <View className="w-1/2 p-1">
                    <Text className="text-gray-700">Fats: {selectedDish.dish_nutrition.fats}g</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Ingredients Section */}
            <View className="mb-4">
              <Text className="text-base font-pbold text-gray-700 mb-2">Ingredients:</Text>
              {(() => {
                if (ingredientsLoading) {
                  return <Text className="text-gray-500 italic">Loading ingredients...</Text>;
                } else if (dishIngredients.length > 0) {
                  return (
                    <ScrollView style={{ maxHeight: 120 }} className="border-t border-b border-gray-200 py-2">
                      {dishIngredients.map((ing, idx) => (
                        <View key={ing.ingredient.id || idx} className="flex-row justify-between py-1">
                          <Text className="text-gray-700">{ing.ingredient.ingredient_name}</Text>
                          <Text className="text-gray-500">{ing.ingredient_amount}g</Text>
                        </View>
                      ))}
                    </ScrollView>
                  );
                } else {
                  return <Text className="text-gray-500 italic">No ingredient information available</Text>;
                }
              })()}
            </View>
            
            {/* Price */}
            <Text className="text-base font-semibold text-green-600">
              Price: RM {selectedDish?.dish_price?.toFixed(2) ?? '0.00'}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}