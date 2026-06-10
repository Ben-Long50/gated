import { useQueries } from '@tanstack/react-query';
import getAction from '../useActionQuery/getAction';

const useActionQueries = (actionIds: number[]) => {
  return useQueries({
    queries: actionIds.map((actionId) => ({
      queryKey: ['action', actionId],
      queryFn: () => getAction.fetch(actionId),
      enabled: !!actionId,
    })),
    combine: (results) => {
      return {
        actions: results.filter(Boolean).map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });
};

export default useActionQueries;
