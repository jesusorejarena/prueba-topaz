import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Star, Heart } from 'lucide-react-native';

import { Product } from '../types';
import { RootStackParamList } from '../navigation';
import { COLORS } from '../constants/theme';
import { useFavoritesStore } from '../store/useFavoritesStore';

interface ProductCardProps {
  item: Product;
  horizontal?: boolean;
}

const ProductCard = React.memo(({ item, horizontal }: ProductCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isFav = useFavoritesStore(state =>
    state.favorites.some(f => f.id === item.id),
  );
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);

  const handleToggleFavorite = () => {
    if (isFav) removeFavorite(item.id);
    else addFavorite(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.push('Detail', { productId: item.id })}
      className={`${
        horizontal ? 'w-48 mr-4' : 'w-[48%] mb-4'
      } bg-white rounded-[24px] p-3 flex flex-col`}
    >
      <View className="items-center bg-gray-50/80 rounded-[20px] p-4 mb-3 h-36 justify-center">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-full"
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full"
        >
          <Heart
            size={18}
            color={isFav ? '#f43f5e' : COLORS.textLight}
            fill={isFav ? '#f43f5e' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      <View className="px-1 justify-between flex-grow">
        <View>
          <Text className="text-[11px] font-bold text-indigo-500 mb-1.5 uppercase tracking-wider">
            {item.category}
          </Text>
          <Text
            className="text-base font-extrabold text-gray-900 mb-1 leading-tight"
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-lg font-black text-indigo-600">
            ${item.price.toFixed(2)}
          </Text>
          {item.rating ? (
            <View className="flex-row items-center gap-2">
              <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
              <Text className="text-xs font-bold text-gray-700">
                {item.rating.toFixed(1)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default ProductCard;
