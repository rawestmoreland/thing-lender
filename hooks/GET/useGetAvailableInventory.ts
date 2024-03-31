import { fetchAvailableInventory } from '@/queries/fetchAvailableInventory';
import { useQuery } from '@tanstack/react-query';

export function useGetAvailableInventory(pb: any) {
  return useQuery({
    queryKey: ['available_things'],
    queryFn: () => fetchAvailableInventory(pb),
    enabled: !!pb,
  });
}
