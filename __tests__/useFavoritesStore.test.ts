import { useFavoritesStore } from '../src/store/useFavoritesStore';
import { Product } from '../src/types';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'A product for testing',
  price: 99.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 100,
  brand: 'Test Brand',
  category: 'smartphones',
  thumbnail: 'https://example.com/thumb.jpg',
  images: ['https://example.com/img1.jpg'],
};

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.getState().clearFavorites();
  });

  it('starts with an empty list of favorites', () => {
    const favorites = useFavoritesStore.getState().favorites;
    expect(favorites).toEqual([]);
  });

  it('adds a favorite correctly', () => {
    useFavoritesStore.getState().addFavorite(mockProduct);
    const favorites = useFavoritesStore.getState().favorites;
    expect(favorites).toHaveLength(1);
    expect(favorites[0]).toEqual(mockProduct);
  });

  it('does not add duplicate favorites', () => {
    useFavoritesStore.getState().addFavorite(mockProduct);
    useFavoritesStore.getState().addFavorite(mockProduct);
    const favorites = useFavoritesStore.getState().favorites;
    expect(favorites).toHaveLength(1);
  });

  it('removes a favorite correctly', () => {
    useFavoritesStore.getState().addFavorite(mockProduct);
    useFavoritesStore.getState().removeFavorite(mockProduct.id);
    const favorites = useFavoritesStore.getState().favorites;
    expect(favorites).toHaveLength(0);
  });

  it('checks if a product is favorite', () => {
    expect(useFavoritesStore.getState().isFavorite(mockProduct.id)).toBe(false);
    useFavoritesStore.getState().addFavorite(mockProduct);
    expect(useFavoritesStore.getState().isFavorite(mockProduct.id)).toBe(true);
  });
});
