import { useQuery } from '@tanstack/react-query';
import getAccount from './getAccount';

const useAccountQuery = () => {
  return useQuery<{ userId: number }>({
    queryKey: ['account'],
    queryFn: async () => await getAccount(),
    throwOnError: false,
  });
};

export default useAccountQuery;
