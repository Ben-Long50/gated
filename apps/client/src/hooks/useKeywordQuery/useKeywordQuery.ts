import { useQuery } from '@tanstack/react-query';
import getKeywordById from './getKeywordById';
import { Keyword } from '@gated/shared';

const useKeywordQuery = (keywordId: number) => {
  return useQuery<Keyword>({
    queryKey: ['keyword', keywordId],
    queryFn: async () => await getKeywordById(keywordId),
  });
};

export default useKeywordQuery;
