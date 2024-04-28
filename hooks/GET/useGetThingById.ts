import { usePocketBase } from '@/context/pocketbase';
import { useQuery } from '@tanstack/react-query';
import { EQueryKey } from '../types';

export function useGetThingById(id: string) {
  const { pb } = usePocketBase();

  return useQuery({
    queryKey: [EQueryKey.Borrower, id],
    queryFn: async () => await pb?.collection('things').getOne(id),
    enabled: !!pb,
  });
}
