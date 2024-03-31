import { usePocketBase } from '@/context/pocketbase';
import { useQuery } from '@tanstack/react-query';

export function useGetInventory() {
  const { pb } = usePocketBase();

  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () =>
      await pb?.collection('things').getFullList({
        expand: 'thing_type,lent_things_via_thing_id.borrower_id',
      }),
    enabled: !!pb,
  });
}
