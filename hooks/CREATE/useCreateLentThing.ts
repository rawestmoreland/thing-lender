import { useAuth } from '@/context/auth';
import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type TCreateLentItemPayload = {
  due_date: string;
  thing_id: string;
  borrower_id?: string;
  owner_user_id?: string;
  returned?: boolean;
};

export function useCreateLentThing() {
  const { pb } = usePocketBase();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateLentItemPayload) =>
      await pb
        ?.collection('lent_things')
        .create({ ...payload, owner_user_id: user?.id }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['lent_things'] }),
  });
}
