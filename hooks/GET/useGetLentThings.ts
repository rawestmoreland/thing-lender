import { usePocketBase } from '@/context/pocketbase';
import { useQuery } from '@tanstack/react-query';

export function useGetLentThings() {
  const { pb } = usePocketBase();

  return useQuery({
    queryKey: ['lent_things'],
    queryFn: async () =>
      await pb?.collection('lent_things').getFullList({
        expand: 'thing_id.thing_type,borrower_id',
        filter: 'returned=false',
      }),
    enabled: !!pb,
  });
}
