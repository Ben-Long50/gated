import { useQuery } from '@tanstack/react-query';
import getKeywordById from './getConditionById';

const useConditionQuery = (conditonId: number) => {
  return useQuery({
    queryKey: ['condition', conditonId],
    queryFn: async () => await getKeywordById(conditonId),
    throwOnError: false,
  });
};

export default useConditionQuery;
