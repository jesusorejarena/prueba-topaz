import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { ShoppingBag, AlertCircle, Search } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export function ProductsLoadingState() {
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

interface ProductsErrorStateProps {
  error: string;
  onRefetch: () => void;
}

export function ProductsErrorState({
  error,
  onRefetch,
}: ProductsErrorStateProps) {
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
        onPress={onRefetch}
        className="bg-indigo-600 px-8 py-4 rounded-full active:bg-indigo-700 flex-row items-center gap-2"
      >
        <Text className="text-white font-bold text-base">
          Intentar de nuevo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function ProductsEmptyState() {
  return (
    <View className="flex-1 justify-center items-center py-20 px-6">
      <Search size={48} color={COLORS.textLight} className="mb-4 opacity-50" />
      <Text className="text-xl font-bold text-gray-900 text-center mb-2">
        Sin resultados
      </Text>
      <Text className="text-gray-500 font-medium text-center text-base">
        No encontramos productos que coincidan con tu búsqueda.
      </Text>
    </View>
  );
}
