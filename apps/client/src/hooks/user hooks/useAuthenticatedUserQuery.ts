import { useQuery } from '@tanstack/react-query';
import { User } from 'src/types/user';
import getAuthenticatedUser from './getAuthenticatedUser';

const useAuthenticatedUserQuery = () => {
  return useQuery<User>({
    queryKey: ['authenticatedUser'],
    queryFn: () => getAuthenticatedUser(),
    throwOnError: false,
  });
};

export default useAuthenticatedUserQuery;
