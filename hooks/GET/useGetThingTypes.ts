import { usePocketBase } from '@/context/pocketbase';
import { useQuery } from '@tanstack/react-query';

export function useGetThingTypes() {
  const { pb } = usePocketBase();

  return useQuery({
    queryKey: ['thingTypes'],
    queryFn: async () => await pb?.collection('thing_types').getFullList(),
    enabled: !!pb,
  });
}
