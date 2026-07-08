import { useState, useCallback, useEffect } from 'react';

import client from '../api/client';
import { Product, ProductsResponse } from '../types';

export function useRelatedProducts(
  category?: string,
  currentProductId?: number,
) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState<boolean>(true);

  const fetchRelated = useCallback(async () => {
    if (!category) return;
    try {
      setLoadingRelated(true);

      const response = await client.get<ProductsResponse>(
        `/products/category/${category}`,
      );

      const filtered = response.data.products
        .filter(p => p.id !== currentProductId)
        .slice(0, 5);

      setRelatedProducts(filtered);
    } catch (err) {
      console.log('Error fetching related products:', err);
    } finally {
      setLoadingRelated(false);
    }
  }, [category, currentProductId]);

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]);

  return { relatedProducts, loadingRelated };
}
