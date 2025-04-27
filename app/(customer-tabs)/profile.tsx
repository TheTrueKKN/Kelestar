import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { useRouter } from 'expo-router';

// Menu item interface
interface MenuItem {
  id: string;
  title: string;
  icon: any;
  route: string;
}

// Menu item component with updated styling
const MenuSquare = ({ item, onPress }: { item: MenuItem; onPress: () => void }) => (
  <TouchableOpacity 
    className="w-[150px] h-[150px] bg-[#dcdddd] rounded-2xl m-2.5 items-center justify-center border border-gray-300 shadow-md"
    onPress={onPress}
  >
    <View className="items-center justify-center h-full">
      <Image 
        source={item.icon}
        className="w-12 h-12"
        resizeMode="contain"
      />
      <Text className="mt-3 font-semibold text-base text-center">{item.title}</Text>
    </View>
  </TouchableOpacity>
);

export default function CustomerProfile() {
  const router = useRouter();

  // Menu items data
  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'History Track',
      icon: icons.history_icon,
      route: '/history',
    },
    {
      id: '2',
      title: 'Carbon Budget',
      icon: icons.money_icon,
      route: '/budget',
    },
    {
      id: '3',
      title: 'FAQs',
      icon: icons.question_icon,
      route: '/faq',
    },
    {
      id: '4',
      title: 'Settings',
      icon: icons.cust_settings_icon,
      route: '/settings',
    },
    {
      id: '5',
      title: 'Badge',
      icon: icons.badge_icon,
      route: '/badge',
    },
    {
      id: '6',
      title: 'Nutrition',
      icon: icons.pizza_icon,
      route: '/nutrition',
    },
  ];

  // Handle menu item press
  const handleMenuPress = (route: string) => {
    try {
      router.push(route);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={true}
      >
        {/* Profile Image Section - increased top padding */}
        <View className="w-full items-center pt-[20px] pb-6">
          {/* Profile image container */}
          <View className="w-[140px] h-[140px] bg-[#F5F5F5] rounded-3xl justify-center items-center relative">
            {/* Default image placeholder */}
            <View className="w-[100px] h-[100px] rounded-full bg-[#E0E0E0] items-center justify-center">
              <Text className="text-[40px] font-psemibold text-gray-500">U</Text>
            </View>
            
            {/* Edit profile image button */}
            <TouchableOpacity 
              className="absolute bottom-2 right-2 bg-white w-9 h-9 rounded-full items-center justify-center shadow-md"
            >
              <Image 
                source={require('../../assets/icons/edit_icon.png')}
                className="w-4.5 h-4.5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          
          {/* User name */}
          <Text className="mt-4 text-[24px] font-pbold">John Doe</Text>
          <Text className="text-[16px] font-pregular text-gray-500">john@example.com</Text>
        </View>

        {/* Menu Grid */}
        <View className="px-[10px] pt-4 mb-20">
          <View className="flex-row flex-wrap justify-center">
            {menuItems.map(item => (
              <MenuSquare 
                key={item.id} 
                item={item} 
                onPress={() => handleMenuPress(item.route)} 
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
