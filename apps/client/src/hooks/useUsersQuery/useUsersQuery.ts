import { useQuery } from '@tanstack/react-query';
import getUsers from './getUsers';
import { User } from 'src/types/user';

const useUsersQuery = (nameQuery: string) => {
  return useQuery<User[]>({
    queryKey: ['users', nameQuery],
    queryFn: async () => await getUsers(nameQuery),
  });
};

export default useUsersQuery;
