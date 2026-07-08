import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Product } from '../types';

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  removeMultipleFavorites: (productIds: number[]) => void;
  clearFavorites: () => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: product =>
        set(state => {
          if (state.favorites.some(fav => fav.id === product.id)) {
            return state;
          }
          return { favorites: [...state.favorites, product] };
        }),
      removeFavorite: productId =>
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== productId),
        })),
      removeMultipleFavorites: productIds =>
        set(state => ({
          favorites: state.favorites.filter(
            fav => !productIds.includes(fav.id),
          ),
        })),
      clearFavorites: () => set({ favorites: [] }),
      isFavorite: productId => {
        return get().favorites.some(fav => fav.id === productId);
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
