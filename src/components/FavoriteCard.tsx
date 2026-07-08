import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Star, Trash2, Circle, CheckCircle2 } from 'lucide-react-native';

import { Product } from '../types';
import { RootStackParamList } from '../navigation';
import { COLORS } from '../constants/theme';
import { useFavoritesStore } from '../store/useFavoritesStore';

interface FavoriteCardProps {
  item: Product;
  isEditing?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const FavoriteCard = React.memo(
  ({ item, isEditing, isSelected, onToggleSelect }: FavoriteCardProps) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const removeFavorite = useFavoritesStore(state => state.removeFavorite);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (isEditing && onToggleSelect) {
            onToggleSelect();
          } else {
            navigation.push('Detail', { productId: item.id });
          }
        }}
        className={`bg-white rounded-[24px] p-4 flex-row items-center mb-4 border-2 ${
          isEditing && isSelected ? 'border-indigo-500' : 'border-transparent'
        }`}
      >
        <View className="flex-row items-center flex-1">
          <View className="w-24 h-24 bg-gray-50/80 rounded-[20px] p-3 mr-4">
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <View className="flex-1 justify-center py-2 pr-2">
            <Text className="text-[11px] font-bold text-indigo-500 mb-1.5 uppercase tracking-wider">
              {item.category}
            </Text>
            <Text
              className="text-base font-extrabold text-gray-900 mb-1 leading-tight"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-lg font-black text-indigo-600">
                ${item.price.toFixed(2)}
              </Text>
              {item.rating ? (
                <View className="flex-row items-center gap-2">
                  <Star
                    size={14}
                    color={COLORS.warning}
                    fill={COLORS.warning}
                  />
                  <Text className="text-xs font-bold text-gray-700">
                    {item.rating.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        <View className="border-l border-gray-100 pl-4 py-2 justify-center items-center">
          {isEditing ? (
            <TouchableOpacity onPress={onToggleSelect} className="p-3">
              {isSelected ? (
                <CheckCircle2
                  size={24}
                  color={COLORS.primary}
                  fill={COLORS.primary}
                />
              ) : (
                <Circle size={24} color={COLORS.textLight} />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => removeFavorite(item.id)}
              className="p-3 bg-rose-50 rounded-full active:bg-rose-100 mr-2"
            >
              <Trash2 size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

export default FavoriteCard;
