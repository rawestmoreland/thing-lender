import { useAuth } from '@/context/auth';
import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type TCreateThingPayload = {
  name: string;
  thing_type: string;
  owner_user_id?: string;
};

export function useCreateThing() {
  const { pb } = usePocketBase();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateThingPayload) =>
      await pb
        ?.collection('things')
        .create({ ...payload, owner_user_id: user?.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });
}
