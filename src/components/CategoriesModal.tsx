import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface CategoriesModalProps {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export default function CategoriesModal({
  visible,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoriesModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity 
          className="flex-1"
          onPress={onClose} 
          activeOpacity={1}
        />
        <View className="bg-white rounded-t-[32px] pt-6 px-6 pb-12 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black text-gray-900 tracking-tight">Todas las categorías</Text>
            <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
              <X size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => { setSelectedCategory(null); onClose(); }}
                className={`px-4 py-2.5 rounded-full border ${!selectedCategory ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}
              >
                <Text className={`font-bold ${!selectedCategory ? 'text-white' : 'text-gray-600'}`}>
                  Todos
                </Text>
              </TouchableOpacity>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => { setSelectedCategory(cat); onClose(); }}
                  className={`px-4 py-2.5 rounded-full border ${selectedCategory === cat ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}
                >
                  <Text className={`font-bold capitalize ${selectedCategory === cat ? 'text-white' : 'text-gray-600'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
