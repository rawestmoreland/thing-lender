import { useAuth } from '@/context/auth';
import { usePocketBase } from '@/context/pocketbase';
import { useMutation } from '@tanstack/react-query';

export function useDeleteAccount() {
  const { pb } = usePocketBase();
  const { signOut, user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!pb || !user) return;

      await pb.collection('users').delete(user.id);
    },
    onSettled: () => signOut(),
  });
}
