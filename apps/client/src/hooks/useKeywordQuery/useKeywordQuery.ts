import { useQuery } from '@tanstack/react-query';
import getKeywordById from './getKeywordById';

const useKeywordQuery = (keywordId: string) => {
  return useQuery({
    queryKey: ['keyword', keywordId],
    queryFn: async () => await getKeywordById(keywordId),
  });
};

export default useKeywordQuery;
