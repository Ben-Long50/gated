import { useQueries } from '@tanstack/react-query';
import getUser from './getUser';

const useUserQueries = (userIds: number[]) => {
  return useQueries({
    queries: userIds?.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => getUser.fetch(userId),
      enabled: !!userId,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data) || [],
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });
};

export default useUserQueries;
