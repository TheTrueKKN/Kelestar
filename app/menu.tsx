import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalSearchParams, useRouter } from 'expo-router'


export default function menu() {
    const { vendorUri, dishUri } = useGlobalSearchParams();
    const router = useRouter();

    const validVendorUri = Array.isArray(vendorUri) ? vendorUri[0] : vendorUri;
    const validDishUri = Array.isArray(dishUri) ? dishUri[0] : dishUri;
    return (
    <View className = "bg-white flex-1">
        {/* header */}
        <Text className='text-semibold text-2xl mt-5 ml - 3'>Hello 'to be filled in'</Text>
        <View className='space-y-2 justify-center items-center'>
            <Image source= {{uri: validVendorUri}} className='w-40 h-40 mt-10' />
        </View>
        <Text className='text-semibold text-center px-5 mt-4'> We've got the poke bowl your're looking for 
            .Full of freshnes, deliciousness, and a whole lot more to come
        </Text>

        {/* Create new dish button */}
        {/* To be added for routing */}
        {/* onPress={() => router.push('/createdish')} */}
        <View className='px-4 mt-6'>
            <TouchableOpacity className='bg-[#74B318] py-3 rounded-md justify-center items-center'>
                <Text className='text-white text-lg font-semibold'>
                    Create new dish + 
                </Text> 
            </TouchableOpacity>

        </View>

    </View>
    
  )
}
