import { useState, useCallback, useEffect, useMemo } from 'react';

import client from '../api/client';
import { Product, ProductsResponse } from '../types';

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'title-asc'
  | null;
export type PriceRange = { min: number; max: number } | null;

const PAGE_SIZE = 20;

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);
  const [sortBy, setSortBy] = useState<SortOption>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await client.get<string[]>('/products/categories');
      if (response.data && response.data.length > 0) {
        if (typeof response.data[0] === 'string') {
          setCategories(response.data);
        } else {
          setCategories(
            (response.data as any).map((c: any) => c.slug || c.name),
          );
        }
      }
    } catch {}
  }, []);

  const fetchProducts = useCallback(
    async (
      currentSkip: number = 0,
      fetchType: 'initial' | 'refresh' | 'loadMore' | 'filter' = 'filter',
    ) => {
      try {
        if (fetchType === 'loadMore') setIsFetchingNextPage(true);
        else if (fetchType === 'refresh') setIsRefreshing(true);
        else setLoading(true);

        setError(null);

        let endpoint = `/products?limit=${PAGE_SIZE}&skip=${currentSkip}`;

        if (searchQuery.trim()) {
          endpoint = `/products/search?q=${encodeURIComponent(
            searchQuery,
          )}&limit=${PAGE_SIZE}&skip=${currentSkip}`;
        } else if (selectedCategory) {
          endpoint = `/products/category/${encodeURIComponent(
            selectedCategory,
          )}?limit=${PAGE_SIZE}&skip=${currentSkip}`;
        }

        if (sortBy) {
          const [field, order] = sortBy.split('-');
          endpoint += `&sortBy=${field}&order=${order}`;
        }

        const response = await client.get<ProductsResponse>(endpoint);
        const newProducts = response.data.products;

        if (fetchType === 'loadMore') {
          setAllProducts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewProducts = newProducts.filter(
              p => !existingIds.has(p.id),
            );
            return [...prev, ...uniqueNewProducts];
          });
        } else {
          setAllProducts(newProducts);
        }

        setHasMore(
          newProducts.length === PAGE_SIZE &&
            currentSkip + PAGE_SIZE < response.data.total,
        );
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error al cargar los productos');
      } finally {
        setLoading(false);
        setIsFetchingNextPage(false);
        setIsRefreshing(false);
        setInitialLoad(false);
      }
    },
    [searchQuery, selectedCategory, sortBy],
  );

  // Initial load and refetch on filter change
  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    fetchProducts(0, initialLoad ? 'initial' : 'filter');
  }, [searchQuery, selectedCategory, sortBy, fetchProducts, initialLoad]);

  // Fetch categories once on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchNextPage = useCallback(() => {
    if (!hasMore || loading || isFetchingNextPage) return;
    const nextSkip = skip + PAGE_SIZE;
    setSkip(nextSkip);
    fetchProducts(nextSkip, 'loadMore');
  }, [hasMore, loading, isFetchingNextPage, skip, fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Price filter
    if (priceRange) {
      result = result.filter(
        p => p.price >= priceRange.min && p.price <= priceRange.max,
      );
    }

    return result;
  }, [allProducts, priceRange]);

  return {
    products: filteredProducts,
    categories,
    initialLoad,
    loading,
    isRefreshing,
    isFetchingNextPage,
    hasMore,
    error,
    refetch: () => {
      setSkip(0);
      fetchProducts(0, 'refresh');
    },
    fetchNextPage,

    // Filter controls
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
  };
}
