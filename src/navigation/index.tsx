/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Dimensions, Text } from 'react-native';
import { ShoppingBag, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

import ProductsScreen from '../screens/ProductsScreen';
import DetailScreen from '../screens/DetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Detail: { productId: number };
};

export type TabParamList = {
  Products: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialTopTabNavigator<TabParamList>();

interface TabIconProps {
  routeName: keyof TabParamList;
  focused: boolean;
  size: number;
}

import { useFavoritesStore } from '../store/useFavoritesStore';

function TabIcon({ routeName, focused, size }: TabIconProps) {
  const IconComponent = routeName === 'Products' ? ShoppingBag : Heart;
  const color = focused ? '#FFFFFF' : COLORS.textLight;
  const favoritesCount = useFavoritesStore(state => state.favorites.length);

  return (
    <View className="flex text-center items-center justify-center relative">
      <IconComponent
        size={size}
        color={color}
        strokeWidth={focused ? 2.5 : 2}
      />
      {routeName === 'Favorites' && favoritesCount > 0 && (
        <View 
          className="absolute -top-1.5 -right-3 bg-rose-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1"
          style={{ borderWidth: 2, borderColor: focused ? COLORS.primary : '#F3F4F6' }}
        >
          <Text className="text-white text-[9px] font-black leading-none">{favoritesCount}</Text>
        </View>
      )}
    </View>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  
  const tabBarWidth = width - 40;
  const tabBarHeight = 56;
  const tabWidth = tabBarWidth / 2;

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabIcon routeName={route.name} focused={focused} size={24} />
          ),
          tabBarIndicatorStyle: {
            height: tabBarHeight - 12,
            width: tabWidth - 12,
            backgroundColor: COLORS.primary,
            marginBottom: 6,
            marginLeft: 6,
            borderRadius: 40,
          },
          tabBarIndicatorContainerStyle: {
            height: tabBarHeight,
          },
          tabBarStyle: {
            position: 'absolute',
            bottom: Math.max(insets.bottom, 10),
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            width: tabBarWidth,
            height: tabBarHeight,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
            backgroundColor: '#F3F4F6',
            borderTopWidth: 0,
          },
          tabBarPressColor: 'transparent',
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen
          name="Products"
          component={ProductsScreen}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
        />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerShadowVisible: false,
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
