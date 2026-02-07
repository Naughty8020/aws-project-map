import { useQuery } from '@tanstack/react-query';
import type { KyotoEvent } from '../types/event.ts';

const API_URL = 'http://localhost:3000/api/events';

const fetchKyotoEvents = async (): Promise<KyotoEvent[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Network response was not ok');

  const result = await response.json();
  console.log('Fetched Kyoto Events:', result);
  // ここで result.data に配列がある場合はそちらを返す
  return Array.isArray(result.data) ? result.data : [];
};

/**
 * React Query hook
 */
export const useKyotoEvents = () => {
  return useQuery({
    queryKey: ['kyotoEvents'],
    queryFn: fetchKyotoEvents,
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
    retry: 2, // 失敗時リトライ回数
  });
};

