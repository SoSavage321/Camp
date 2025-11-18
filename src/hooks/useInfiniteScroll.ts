import { useState, useCallback } from 'react';

export function useInfiniteScroll<T>(
  fetchData: (page: number) => Promise<{ items: T[]; hasMore: boolean }>
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchData(page);
      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchData]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return { items, loading, hasMore, loadMore, reset };
}