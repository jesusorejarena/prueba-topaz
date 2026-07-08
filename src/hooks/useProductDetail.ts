import { useState, useCallback, useEffect } from 'react';

import client from '../api/client';
import { Product } from '../types';

export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await client.get<Product>(`/products/${productId}`);
      setProduct(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los detalles');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  return { product, loading, error, refetch: fetchProductDetail };
}
