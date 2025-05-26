import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { useRouter } from 'expo-router';
import { getUser } from '../../controllers/userController';

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
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user?.user_name) setUserName(user.user_name);
    };
    fetchUser();
  }, []);

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
        {/* Modern Name Banner Section with Avatar */}
        <View className="w-full items-center pb-6">
          <View className="w-full bg-green rounded-b-3xl py-7 px-6 shadow-lg items-center justify-center">
            <View className="mb-3 w-20 h-20 rounded-full bg-white items-center justify-center shadow-md border-4 border-green-700">
              <Image
                source={require('../../assets/images/default-avatar.jpg')}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-2xl font-extrabold text-white tracking-wide" style={{ color: '#22C55E', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 6, overflow: 'hidden', marginTop: 4 }}>{userName || 'User'}</Text>
          </View>
        </View>

        {/* Menu Grid (without Badge and Nutrition) */}
        <View className="px-[10px] pt-4 mb-20">
          <View className="flex-row flex-wrap justify-center">
            {menuItems.filter(item => item.title !== 'Badge' && item.title !== 'Nutrition').map(item => (
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
