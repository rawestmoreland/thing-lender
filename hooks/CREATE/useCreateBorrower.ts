import { useAuth } from '@/context/auth';
import { usePocketBase } from '@/context/pocketbase';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { EQueryKey } from '../types';

export type TCreateBorrowerPayload = {
  name: string;
  email?: string;
  phone_number?: string;
  owner_user_id?: string;
};

export function useCreateBorrower() {
  const { pb } = usePocketBase();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (payload: TCreateBorrowerPayload) =>
      await pb
        ?.collection('borrowers')
        .create({ ...payload, owner_user_id: user?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.Borrowers] });
    },
  });
}
