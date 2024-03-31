import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EQueryKey } from '../types';

export function useDeleteLentThing() {
  const { pb } = usePocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lentThingId: string): Promise<void> => {
      await pb?.collection('lent_things').delete(lentThingId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [EQueryKey.LentThings] });
      await queryClient.invalidateQueries({ queryKey: [EQueryKey.Inventory] });
    },
  });
}
