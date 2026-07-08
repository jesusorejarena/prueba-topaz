import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { Product } from '../types';

interface DetailFooterProps {
  product: Product | null;
  insetsBottom: number;
  isFav: boolean;
  animatedFillStyle: any;
  handleToggleFavorite: () => void;
}

export default function DetailFooter({
  product,
  insetsBottom,
  isFav,
  animatedFillStyle,
  handleToggleFavorite,
}: DetailFooterProps) {
  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white/80 border-t border-gray-100 px-6 py-4 flex-row items-center justify-between"
      style={{ paddingBottom: Math.max(insetsBottom, 20) }}
    >
      <View>
        <Text className="text-sm text-gray-500 font-medium">Precio Total</Text>
        <Text className="text-2xl font-black text-gray-900">
          ${product?.price.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleToggleFavorite}
        activeOpacity={0.8}
        className={`px-6 py-4 rounded-[20px] flex-row items-center justify-center min-w-[140px] ${
          isFav ? 'bg-rose-500' : 'bg-indigo-600'
        }`}
      >
        <View className="w-5 h-5 mr-2 relative justify-end">
          {/* Base Empty Heart */}
          <View className="absolute top-0 left-0">
            <Heart
              size={20}
              color={COLORS.background}
              fill="transparent"
              strokeWidth={2.5}
            />
          </View>

          {/* Animated Filled Heart (Revealed from bottom to top) */}
          <Animated.View
            className="absolute bottom-0 left-0 overflow-hidden w-5"
            style={animatedFillStyle}
          >
            <View className="absolute bottom-0 left-0 h-5 w-5">
              <Heart
                size={20}
                color={COLORS.background}
                fill={COLORS.background}
                strokeWidth={2.5}
              />
            </View>
          </Animated.View>
        </View>
        <Text className="text-white text-base font-bold">
          {isFav ? 'Quitar' : 'Añadir'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
