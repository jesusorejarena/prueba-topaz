import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, Search, X, SlidersHorizontal, ArrowDownAZ, ArrowDown01, ArrowUp10, Star, ShoppingBag, ChevronRight } from 'lucide-react-native';

import { COLORS } from '../constants/theme';
import ProductCard from '../components/ProductCard';
import { useProducts, SortOption } from '../hooks/useProducts';

export default function ProductsScreen() {
  const { 
    products, 
    categories,
    initialLoad,
    loading,
    isRefreshing,
    isFetchingNextPage,
    hasMore,
    error, 
    refetch,
    fetchNextPage,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    sortBy, setSortBy,
    priceRange, setPriceRange
  } = useProducts();

  const [showFilters, setShowFilters] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const translateY = React.useRef(new Animated.Value(0)).current;
  const lastScrollY = React.useRef(0);
  const headerHeight = React.useRef(200);
  const titleHeight = React.useRef(60);
  const scrollTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paddingTop, setPaddingTop] = useState(200);

  const handleScroll = (e: any) => {
    const currentY = e.nativeEvent.contentOffset.y;
    
    if (currentY < 0) return;

    if (currentY <= 50) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }).start();
      lastScrollY.current = currentY;
      return;
    }

    const diff = currentY - lastScrollY.current;
    
    if (Math.abs(diff) > 10) {
      if (diff > 0) {
        Animated.timing(translateY, {
          toValue: -headerHeight.current,
          duration: 80,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: -titleHeight.current,
          duration: 80,
          useNativeDriver: true,
        }).start();
      }
      lastScrollY.current = currentY;
    }

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      if (lastScrollY.current <= titleHeight.current) {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: -titleHeight.current,
          duration: 80,
          useNativeDriver: true,
        }).start();
      }
    }, 200);
  };

  const toggleSort = (option: SortOption) => {
    setSortBy(prev => prev === option ? null : option);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (initialLoad && loading) {
    return (
      <Modal visible animationType="fade" transparent={false}>
        <View className="flex-1 bg-indigo-600 justify-center items-center">
          <View className="bg-white/20 p-6 rounded-full mb-8">
            <ShoppingBag size={64} color="#FFF" />
          </View>
          <Text className="text-white text-4xl font-black tracking-tight mb-2">
            Topaz
          </Text>
          <Text className="text-indigo-200 text-base font-medium tracking-wide mb-12">
            Descubriendo cosas increíbles...
          </Text>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      </Modal>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <View className="bg-red-100 p-6 rounded-full mb-6">
          <AlertCircle size={48} color={COLORS.error} />
        </View>
        <Text className="text-2xl font-black text-gray-900 mb-3 text-center">
          Ups, algo salió mal
        </Text>
        <Text className="text-base text-gray-500 text-center mb-8 leading-relaxed">
          {error}
        </Text>
        <TouchableOpacity
          onPress={refetch}
          className="bg-indigo-600 px-8 py-4 rounded-full active:bg-indigo-700 flex-row items-center gap-2"
        >
          <Text className="text-white font-bold text-base">
            Intentar de nuevo
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <Animated.View 
      onLayout={(e) => {
        const height = e.nativeEvent.layout.height;
        headerHeight.current = height;
        setPaddingTop(height);
      }}
      style={{ transform: [{ translateY }] }}
      className="absolute top-0 left-0 right-0 z-10 bg-gray-50 px-5 pb-4 pt-2"
    >
      <View onLayout={(e) => { titleHeight.current = e.nativeEvent.layout.height; }}>
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
            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
              <X size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          onPress={toggleFilters}
          className={`h-12 w-12 rounded-2xl items-center justify-center ${showFilters ? 'bg-indigo-600' : 'bg-white border border-gray-100'}`}
        >
          <SlidersHorizontal size={20} color={showFilters ? '#FFF' : COLORS.textDark} />
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
            className={`px-4 py-2.5 rounded-full border ${!selectedCategory ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}
          >
            <Text className={`font-bold ${!selectedCategory ? 'text-white' : 'text-gray-600'}`}>
              Todos
            </Text>
          </TouchableOpacity>
          {categories.slice(0, 5).map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-full border ${selectedCategory === cat ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}
            >
              <Text className={`font-bold capitalize ${selectedCategory === cat ? 'text-white' : 'text-gray-600'}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
          {categories.length > 5 && (
            <TouchableOpacity
              onPress={() => setShowAllCategories(true)}
              className="px-4 py-2.5 rounded-full border bg-indigo-50 border-indigo-100 flex-row items-center"
            >
              <Text className="font-bold text-indigo-600 mr-1">
                Ver todas
              </Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="flex-1 overflow-hidden">
        {renderHeader()}
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductCard item={item} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperClassName="justify-between px-5"
          contentContainerStyle={{ paddingTop: paddingTop + 10 }}
          contentContainerClassName="pb-24"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshing={isRefreshing}
          onRefresh={refetch}
          onEndReached={hasMore ? fetchNextPage : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-6 items-center justify-center">
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20 px-6">
              <Search size={48} color={COLORS.textLight} className="mb-4 opacity-50" />
              <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                Sin resultados
              </Text>
              <Text className="text-gray-500 font-medium text-center text-base">
                No encontramos productos que coincidan con tu búsqueda.
              </Text>
            </View>
          }
        />
      </View>

      {/* All Categories Bottom Sheet */}
      <Modal visible={showAllCategories} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableOpacity 
            className="flex-1"
            onPress={() => setShowAllCategories(false)} 
            activeOpacity={1}
          />
          <View className="bg-white rounded-t-[32px] pt-6 px-6 pb-12 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-gray-900 tracking-tight">Todas las categorías</Text>
              <TouchableOpacity onPress={() => setShowAllCategories(false)} className="bg-gray-100 p-2 rounded-full">
                <X size={20} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => { setSelectedCategory(null); setShowAllCategories(false); }}
                  className={`px-4 py-2.5 rounded-full border ${!selectedCategory ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}
                >
                  <Text className={`font-bold ${!selectedCategory ? 'text-white' : 'text-gray-600'}`}>
                    Todos
                  </Text>
                </TouchableOpacity>
                {categories.map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => { setSelectedCategory(cat); setShowAllCategories(false); }}
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

      {/* Filters Bottom Sheet */}
      <Modal visible={showFilters} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableOpacity 
            className="flex-1"
            onPress={() => setShowFilters(false)} 
            activeOpacity={1}
          />
          <View className="bg-white rounded-t-[32px] pt-6 px-6 pb-12">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-gray-900 tracking-tight">Opciones</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)} className="bg-gray-100 p-2 rounded-full">
                <X size={20} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            
            <Text className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Ordenar por</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              <TouchableOpacity 
                onPress={() => toggleSort('price-asc')}
                className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${sortBy === 'price-asc' ? 'bg-indigo-100 border border-indigo-200' : 'bg-gray-50 border border-gray-100'}`}
              >
                <ArrowUp10 size={18} color={sortBy === 'price-asc' ? COLORS.primary : COLORS.textLight} />
                <Text className={`font-medium ${sortBy === 'price-asc' ? 'text-indigo-700' : 'text-gray-600'}`}>Precio Menor</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => toggleSort('price-desc')}
                className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${sortBy === 'price-desc' ? 'bg-indigo-100 border border-indigo-200' : 'bg-gray-50 border border-gray-100'}`}
              >
                <ArrowDown01 size={18} color={sortBy === 'price-desc' ? COLORS.primary : COLORS.textLight} />
                <Text className={`font-medium ${sortBy === 'price-desc' ? 'text-indigo-700' : 'text-gray-600'}`}>Precio Mayor</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => toggleSort('title-asc')}
                className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${sortBy === 'title-asc' ? 'bg-indigo-100 border border-indigo-200' : 'bg-gray-50 border border-gray-100'}`}
              >
                <ArrowDownAZ size={18} color={sortBy === 'title-asc' ? COLORS.primary : COLORS.textLight} />
                <Text className={`font-medium ${sortBy === 'title-asc' ? 'text-indigo-700' : 'text-gray-600'}`}>Nombre</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => toggleSort('rating-desc')}
                className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl ${sortBy === 'rating-desc' ? 'bg-amber-100 border border-amber-200' : 'bg-gray-50 border border-gray-100'}`}
              >
                <Star size={18} color={sortBy === 'rating-desc' ? COLORS.warning : COLORS.textLight} />
                <Text className={`font-medium ${sortBy === 'rating-desc' ? 'text-amber-700' : 'text-gray-600'}`}>Calificación</Text>
              </TouchableOpacity>
            </View>

            <View className="h-px bg-gray-100 mb-6" />

            <Text className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Precio</Text>
            <View className="flex-row flex-wrap gap-2">
              {[
                { label: 'Cualquiera', min: 0, max: Infinity },
                { label: 'Menos de $50', min: 0, max: 49.99 },
                { label: '$50 - $200', min: 50, max: 200 },
                { label: 'Más de $200', min: 200.01, max: Infinity },
              ].map((range, index) => {
                const isSelected = priceRange?.min === range.min && priceRange?.max === range.max || (!priceRange && index === 0);
                return (
                  <TouchableOpacity 
                    key={index}
                    onPress={() => setPriceRange(index === 0 ? null : { min: range.min, max: range.max })}
                    className={`px-4 py-2.5 rounded-xl ${isSelected ? 'bg-indigo-600 border border-indigo-600' : 'bg-gray-50 border border-gray-100'}`}
                  >
                    <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
