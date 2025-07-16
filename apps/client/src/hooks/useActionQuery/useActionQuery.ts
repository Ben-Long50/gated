import { useQuery } from '@tanstack/react-query';
import getKeywordById from './getActionById';

const useActionQuery = (actionId: string) => {
  return useQuery({
    queryKey: ['action', actionId],
    queryFn: async () => await getKeywordById(actionId),
  });
};

export default useActionQuery;
