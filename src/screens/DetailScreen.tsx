import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Star, AlertCircle, Heart } from 'lucide-react-native';

import { RootStackParamList } from '../navigation';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { COLORS } from '../constants/theme';
import { useProductDetail } from '../hooks/useProductDetail';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import ProductCard from '../components/ProductCard';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

export default function DetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { productId } = route.params;
  const { width } = useWindowDimensions();

  const { product, loading, error, refetch } = useProductDetail(productId);
  const { relatedProducts } = useRelatedProducts(product?.category, productId);
  const [activeIndex, setActiveIndex] = useState(0);

  // Zustand Store
  const favorites = useFavoritesStore(state => state.favorites);
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);

  const isFav = favorites.some(fav => fav.id === productId);
  const scale = useSharedValue(1);

  const handleToggleFavorite = () => {
    if (!product) return;

    // Heart animation
    scale.value = withSequence(
      withSpring(1.4, { damping: 2, stiffness: 80 }),
      withSpring(1, { damping: 4, stiffness: 40 }),
    );

    if (isFav) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="mt-6 text-gray-500 font-bold text-base tracking-wide">
          Cargando detalles...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <View className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle size={36} color={COLORS.error} />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-2">Error</Text>
        <Text className="text-gray-500 text-center mb-6">
          {error || 'No encontrado.'}
        </Text>
        <TouchableOpacity
          onPress={refetch}
          className="bg-indigo-600 px-8 py-3.5 rounded-full active:bg-indigo-700"
        >
          <Text className="text-white font-bold text-base">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  return (
    <View className="flex-1 bg-white">
      {/* Custom Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        style={[styles.backButton, { top: Math.max(insets.top, 10) }]}
        className="absolute z-50 w-11 h-11 bg-white/90 rounded-full items-center justify-center"
      >
        <ChevronLeft size={24} color={COLORS.textDark} />
      </TouchableOpacity>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Horizontal Carousel */}
        <View
          className="bg-gray-50/80 rounded-b-[40px] overflow-hidden"
          style={[styles.imageContainer, { paddingTop: insets.top }]}
        >
          <FlatList
            data={imagesList}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{ width }}
                className="h-full justify-center items-center p-6"
              >
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            )}
          />
          {/* Pagination Indicators */}
          {imagesList.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
              {imagesList.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-indigo-600'
                      : 'w-2 bg-black/20'
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Details */}
        <View className="flex-1 bg-white rounded-t-[32px] mt-0 px-6 pt-8 pb-10">
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-indigo-50 px-3 py-1.5 rounded-full">
              <Text className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                {product.category}
              </Text>
            </View>
            {product.rating && (
              <View className="flex-row items-center gap-2 bg-amber-50 px-2.5 py-1.5 rounded-full">
                <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
                <Text className="text-sm font-bold text-amber-700">
                  {product.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-3xl font-black text-gray-900 mb-2 leading-tight">
            {product.title}
          </Text>

          <Text className="text-4xl font-extrabold text-indigo-600 mb-8 tracking-tight">
            ${product.price.toFixed(2)}
          </Text>

          <Text className="text-lg font-bold text-gray-900 mb-3">
            Descripción
          </Text>
          <Text className="text-base text-gray-600 leading-relaxed mb-8">
            {product.description}
          </Text>

          {product.brand && (
            <View className="flex-row justify-between py-4 border-b border-gray-100">
              <Text className="text-gray-500 font-medium text-base">Marca</Text>
              <Text className="text-gray-900 font-bold text-base">
                {product.brand}
              </Text>
            </View>
          )}

          {product.stock !== undefined && (
            <View className="flex-row justify-between py-4 border-b border-gray-100 mb-8">
              <Text className="text-gray-500 font-medium text-base">
                Disponibilidad
              </Text>
              <Text
                className={`font-bold text-base ${
                  product.stock > 0 ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
              </Text>
            </View>
          )}
        </View>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <View className="mb-12 bg-white">
            <Text className="text-xl font-bold text-gray-900 mb-4 px-6">
              Productos Relacionados
            </Text>
            <FlatList
              data={relatedProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedListContainer}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ProductCard item={item} horizontal />}
            />
          </View>
        )}
        
        {/* Extra padding to ensure ScrollView content isn't hidden behind the absolute footer */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Modern Floating Action Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white/80 border-t border-gray-100 px-6 py-4 flex-row items-center justify-between"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <View>
          <Text className="text-sm text-gray-500 font-medium">
            Precio Total
          </Text>
          <Text className="text-2xl font-black text-gray-900">
            ${product?.price.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
          className={`px-8 py-4 rounded-[20px] flex-row items-center ${
            isFav
              ? 'bg-rose-500'
              : 'bg-indigo-600'
          }`}
        >
          <Animated.View style={animatedHeartStyle} className="mr-2">
            <Heart
              size={20}
              color={COLORS.background}
              fill={isFav ? COLORS.background : 'transparent'}
              strokeWidth={2.5}
            />
          </Animated.View>
          <Text className="text-white text-base font-bold">
            {isFav ? 'Quitar' : 'Añadir'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    left: 20,
  },
  imageContainer: {
    height: 400,
  },
  relatedListContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  spacer: {
    height: 100,
  },
});
