import { useAuth } from '@/context/auth';
import { usePocketBase } from '@/context/pocketbase';
import { useQuery } from '@tanstack/react-query';

export function useGetBorrowers() {
  const { pb } = usePocketBase();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['borrowers'],
    queryFn: async () => await pb?.collection('borrowers').getFullList(),
    enabled: !!pb,
  });
}
