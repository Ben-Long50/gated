import { useQuery } from '@tanstack/react-query';
import { User } from 'src/types/user';
import getUsersByUsernameQuery from './getUsersByUsernameQuery';
import { useEffect, useState } from 'react';

const useUsersByUsernameQuery = (nameQuery: string) => {
  const [debouncingQuery, setDebouncingQuery] = useState<string | undefined>(
    '',
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncingQuery(nameQuery), 300);
    return () => clearTimeout(timer);
  }, [nameQuery]);

  return useQuery<User[]>({
    queryKey: ['users', debouncingQuery],
    queryFn: async () => await getUsersByUsernameQuery(debouncingQuery),
    enabled: debouncingQuery != null,
  });
};

export default useUsersByUsernameQuery;
