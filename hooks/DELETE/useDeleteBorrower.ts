import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EQueryKey } from '../types';

export function useDeleteBorrower() {
  const { pb } = usePocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      await pb?.collection('borrowers').delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [EQueryKey.Borrowers],
      });
      await queryClient.invalidateQueries({
        queryKey: [EQueryKey.LentThings],
      });
    },
  });
}
