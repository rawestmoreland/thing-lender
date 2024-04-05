import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type TUpdateThingPayload = {
  name: string;
  thing_type: string;
};

export function useUpdateThing(id: string) {
  const { pb } = usePocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TUpdateThingPayload) =>
      await pb?.collection('things').update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['thing', id] });
    },
  });
}
