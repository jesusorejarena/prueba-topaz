import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Trash2 } from 'lucide-react-native';

import { useFavoritesStore } from '../store/useFavoritesStore';
import FavoriteCard from '../components/FavoriteCard';

export default function FavoritesScreen() {
  const favorites = useFavoritesStore(state => state.favorites);
  const clearFavorites = useFavoritesStore(state => state.clearFavorites);
  const removeMultipleFavorites = useFavoritesStore(state => state.removeMultipleFavorites);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDelete = () => {
    if (selectedIds.length > 0) {
      removeMultipleFavorites(selectedIds);
      setSelectedIds([]);
      setIsEditing(false);
    } else {
      clearFavorites();
      setIsEditing(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <View className="px-5">
            <FavoriteCard 
              item={item} 
              isEditing={isEditing}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={() => handleToggleSelect(item.id)}
            />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerClassName="pt-2 pb-24"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          favorites.length > 0 ? (
            <View className="px-5 pb-4">
              <View className="flex-row justify-between items-center mb-4 mt-2">
                <Text className="text-4xl font-black text-indigo-600 tracking-tight leading-tight flex-1">
                  Tus cosas favoritas
                </Text>
                <TouchableOpacity 
                  onPress={() => { setIsEditing(!isEditing); setSelectedIds([]); }} 
                  className="ml-4 bg-indigo-50 py-2.5 rounded-full active:bg-indigo-100 w-28 items-center justify-center"
                >
                  <Text className="text-sm font-bold text-indigo-600">
                    {isEditing ? 'Cancelar' : 'Seleccionar'}
                  </Text>
                </TouchableOpacity>
              </View>
              {isEditing && (
                <TouchableOpacity 
                  onPress={handleDelete}
                  className="bg-rose-500 py-3.5 rounded-xl flex-row items-center justify-center mb-2 active:bg-rose-600"
                >
                  <Trash2 size={20} color="#FFF" />
                  <Text className="text-white font-bold text-base ml-2">
                    {selectedIds.length > 0 ? `Eliminar ${selectedIds.length} seleccionados` : 'Eliminar todos'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20 px-8 mt-10">
            <View className="bg-indigo-50 w-32 h-32 rounded-full mb-8 items-center justify-center">
              <Heart size={64} color="#f43f5e" fill="#f43f5e" />
            </View>
            <Text className="text-2xl font-black text-gray-900 mb-3 text-center">
              Sin favoritos aún
            </Text>
            <Text className="text-base text-gray-500 text-center leading-relaxed">
              Explora nuestros productos y guarda los que más te gusten para
              acceder a ellos rápidamente.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

