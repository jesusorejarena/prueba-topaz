import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import {
  X,
  ArrowDownAZ,
  ArrowDown01,
  ArrowUp10,
  Star,
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { SortOption } from '../hooks/useProducts';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: SortOption | null;
  setSortBy: (option: SortOption | null) => void;
  priceRange: { min: number; max: number } | null;
  setPriceRange: (range: { min: number; max: number } | null) => void;
}

export default function FiltersModal({
  visible,
  onClose,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
}: FiltersModalProps) {
  const toggleSort = (option: SortOption) => {
    setSortBy(sortBy === option ? null : option);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />
        <View className="bg-white rounded-t-[32px] pt-6 px-6 pb-12">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black text-gray-900 tracking-tight">
              Opciones
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-100 p-2 rounded-full"
            >
              <X size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Ordenar por
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            <TouchableOpacity
              onPress={() => toggleSort('price-asc')}
              className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${
                sortBy === 'price-asc'
                  ? 'bg-indigo-100 border border-indigo-200'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <ArrowUp10
                size={18}
                color={
                  sortBy === 'price-asc' ? COLORS.primary : COLORS.textLight
                }
              />
              <Text
                className={`font-medium ${
                  sortBy === 'price-asc' ? 'text-indigo-700' : 'text-gray-600'
                }`}
              >
                Precio Menor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleSort('price-desc')}
              className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${
                sortBy === 'price-desc'
                  ? 'bg-indigo-100 border border-indigo-200'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <ArrowDown01
                size={18}
                color={
                  sortBy === 'price-desc' ? COLORS.primary : COLORS.textLight
                }
              />
              <Text
                className={`font-medium ${
                  sortBy === 'price-desc' ? 'text-indigo-700' : 'text-gray-600'
                }`}
              >
                Precio Mayor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleSort('title-asc')}
              className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${
                sortBy === 'title-asc'
                  ? 'bg-indigo-100 border border-indigo-200'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <ArrowDownAZ
                size={18}
                color={
                  sortBy === 'title-asc' ? COLORS.primary : COLORS.textLight
                }
              />
              <Text
                className={`font-medium ${
                  sortBy === 'title-asc' ? 'text-indigo-700' : 'text-gray-600'
                }`}
              >
                Nombre
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleSort('rating-desc')}
              className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${
                sortBy === 'rating-desc'
                  ? 'bg-amber-100 border border-amber-200'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <Star
                size={18}
                color={
                  sortBy === 'rating-desc' ? COLORS.warning : COLORS.textLight
                }
              />
              <Text
                className={`font-medium ${
                  sortBy === 'rating-desc' ? 'text-amber-700' : 'text-gray-600'
                }`}
              >
                Calificación
              </Text>
            </TouchableOpacity>
          </View>

          <View className="h-px bg-gray-100 mb-6" />

          <Text className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Precio
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: 'Cualquiera', min: 0, max: Infinity },
              { label: 'Menos de $50', min: 0, max: 49.99 },
              { label: '$50 - $200', min: 50, max: 200 },
              { label: 'Más de $200', min: 200.01, max: Infinity },
            ].map((range, index) => {
              const isSelected =
                (priceRange?.min === range.min &&
                  priceRange?.max === range.max) ||
                (!priceRange && index === 0);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    setPriceRange(
                      index === 0 ? null : { min: range.min, max: range.max },
                    )
                  }
                  className={`px-4 py-2.5 rounded-xl ${
                    isSelected
                      ? 'bg-indigo-600 border border-indigo-600'
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
