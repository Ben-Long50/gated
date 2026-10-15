import { useQuery } from '@tanstack/react-query';
import { User } from 'src/types/user';
import getUser from './getUser';

const useUserQuery = (userId: number) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => getUser.fetch(userId),
    enabled: !!userId,
    throwOnError: false,
  });
};

export default useUserQuery;
