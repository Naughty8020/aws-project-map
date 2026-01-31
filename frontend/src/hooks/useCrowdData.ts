import type { Spot } from '../types/spot';
import { useQuery } from '@tanstack/react-query';
import { KYOTO_SPOTS } from '../data';

export const useCrowdData = () => {
  return useQuery<Spot[]>({
    queryKey: ['crowdData', 'kyoto'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return KYOTO_SPOTS;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
