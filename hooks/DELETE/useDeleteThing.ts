import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EQueryKey } from '../types';

export function useDeleteThing() {
  const { pb } = usePocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (thingId: string): Promise<void> => {
      await pb?.collection('things').delete(thingId);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [EQueryKey.Inventory] });
      await queryClient.invalidateQueries({ queryKey: [EQueryKey.LentThings] });
    },
  });
}
