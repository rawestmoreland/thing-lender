import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateLentThing = () => {
  const { pb } = usePocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, any>;
    }) => await pb?.collection('lent_things').update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lent_things'] });
    },
  });
};
