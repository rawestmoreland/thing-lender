import { usePocketBase } from '@/context/pocketbase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type TUpdateBorrowerPayload = {
  name: string;
  email?: string;
  phone_number?: string;
};

export function useUpdateBorrower(id: string) {
  const { pb } = usePocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TUpdateBorrowerPayload) =>
      await pb?.collection('borrowers').update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['borrower', id] });
    },
  });
}
