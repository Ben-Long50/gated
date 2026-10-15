import { useQuery } from '@tanstack/react-query';
import getKeywordById from './getKeywordById';
import { Keyword } from 'src/types/keyword';

const useKeywordQuery = (keywordId: number) => {
  return useQuery<Keyword>({
    queryKey: ['keyword', keywordId],
    queryFn: async () => await getKeywordById(keywordId),
  });
};

export default useKeywordQuery;
