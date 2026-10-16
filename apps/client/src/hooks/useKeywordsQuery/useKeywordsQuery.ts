import { useQuery } from '@tanstack/react-query';
import getKeywords from './getKeywords';
import { Keyword } from '@gated/shared';

const useKeywordsQuery = () => {
  return useQuery<Keyword[]>({
    queryKey: ['keywords'],
    queryFn: async () => await getKeywords(),
  });
};

export default useKeywordsQuery;
