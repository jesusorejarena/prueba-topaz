import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface ProductsHeaderProps {
  translateY: Animated.Value;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  toggleFilters: () => void;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  setShowAllCategories: (show: boolean) => void;
  onHeaderLayout: (height: number) => void;
  onTitleLayout: (height: number) => void;
}

export default function ProductsHeader({
  translateY,
  searchQuery,
  setSearchQuery,
  showFilters,
  toggleFilters,
  categories,
  selectedCategory,
  setSelectedCategory,
  setShowAllCategories,
  onHeaderLayout,
  onTitleLayout,
}: ProductsHeaderProps) {
  return (
    <Animated.View
      onLayout={(e: LayoutChangeEvent) =>
        onHeaderLayout(e.nativeEvent.layout.height)
      }
      style={{ transform: [{ translateY }] }}
      className="absolute top-0 left-0 right-0 z-10 bg-gray-50 px-5 pb-4 pt-2"
    >
      <View
        onLayout={(e: LayoutChangeEvent) =>
          onTitleLayout(e.nativeEvent.layout.height)
        }
      >
        <Text className="text-4xl font-black text-indigo-600 tracking-tight leading-tight mb-4">
          Encuentra lo que buscas
        </Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center gap-2 mb-4">
        <View className="flex-1 flex-row items-center bg-white h-12 px-4 rounded-2xl border border-gray-100">
          <Search size={20} color={COLORS.textLight} />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800 h-full"
            placeholder="Buscar productos..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              className="p-1"
            >
              <X size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={toggleFilters}
          className={`h-12 w-12 rounded-2xl items-center justify-center ${
            showFilters ? 'bg-indigo-600' : 'bg-white border border-gray-100'
          }`}
        >
          <SlidersHorizontal
            size={20}
            color={showFilters ? '#FFF' : COLORS.textDark}
          />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View className="-mx-5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 gap-2"
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-full border ${
              !selectedCategory
                ? 'bg-gray-900 border-gray-900'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text
              className={`font-bold ${
                !selectedCategory ? 'text-white' : 'text-gray-600'
              }`}
            >
              Todos
            </Text>
          </TouchableOpacity>
          {categories.slice(0, 5).map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-full border ${
                selectedCategory === cat
                  ? 'bg-gray-900 border-gray-900'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`font-bold capitalize ${
                  selectedCategory === cat ? 'text-white' : 'text-gray-600'
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
          {categories.length > 5 && (
            <TouchableOpacity
              onPress={() => setShowAllCategories(true)}
              className="px-4 py-2.5 rounded-full border bg-indigo-50 border-indigo-100 flex-row items-center"
            >
              <Text className="font-bold text-indigo-600 mr-1">Ver todas</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
}
