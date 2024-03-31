import { usePocketBase } from '@/context/pocketbase';
import { useQuery } from '@tanstack/react-query';
import { EQueryKey } from '../types';

export function useGetBorrowerById(id: string) {
  const { pb } = usePocketBase();

  return useQuery({
    queryKey: [EQueryKey.Borrower, id],
    queryFn: async () => await pb?.collection('borrowers').getOne(id),
    enabled: !!pb,
  });
}
