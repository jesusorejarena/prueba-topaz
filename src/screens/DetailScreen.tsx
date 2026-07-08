import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
} from 'react-native';

import { useRoute, RouteProp } from '@react-navigation/native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, AlertCircle } from 'lucide-react-native';

import { RootStackParamList } from '../navigation';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { COLORS } from '../constants/theme';
import { useProductDetail } from '../hooks/useProductDetail';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import ProductCard from '../components/ProductCard';

import BackButton from '../components/BackButton';
import ImageCarousel from '../components/ImageCarousel';
import DetailFooter from '../components/DetailFooter';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

export default function DetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { productId } = route.params;
  const { width } = useWindowDimensions();

  const { product, loading, error, refetch } = useProductDetail(productId);
  const { relatedProducts } = useRelatedProducts(product?.category, productId);

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
      <BackButton />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ImageCarousel
          images={imagesList}
          width={width}
          insetsTop={insets.top}
        />

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
              contentContainerClassName="px-6 pb-5"
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => <ProductCard item={item} horizontal />}
            />
          </View>
        )}

        {/* Extra padding to ensure ScrollView content isn't hidden behind the absolute footer */}
        <View className="h-[100px]" />
      </ScrollView>

      <DetailFooter
        product={product}
        insetsBottom={insets.bottom}
        isFav={isFav}
        animatedHeartStyle={animatedHeartStyle}
        handleToggleFavorite={handleToggleFavorite}
      />
    </View>
  );
}
