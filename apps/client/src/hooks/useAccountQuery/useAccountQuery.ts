import { useQuery } from '@tanstack/react-query';
import getAccount from './getAccount';
import { User } from 'src/types/user';

const useAccountQuery = () => {
  return useQuery<User>({
    queryKey: ['account'],
    queryFn: async () => await getAccount(),
    throwOnError: false,
  });
};

export default useAccountQuery;
