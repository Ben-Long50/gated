import { useQuery } from '@tanstack/react-query';
import getBookSections from './getBookSections';

const useBookSectionsQuery = () => {
  return useQuery({
    queryKey: ['book'],
    queryFn: async () => await getBookSections(),
  });
};

export default useBookSectionsQuery;
