import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EQueryKey } from '../types';

export function useDeleteBorrower(id: string) {
  const { pb } = usePocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => await pb?.collection('borrowers').delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [EQueryKey.Borrower, id],
      });
      await queryClient.invalidateQueries({ queryKey: [EQueryKey.Borrowers] });
    },
  });
}
