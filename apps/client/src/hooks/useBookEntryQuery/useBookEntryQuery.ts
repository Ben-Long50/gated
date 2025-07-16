import { useQuery } from '@tanstack/react-query';
import getBookEntry from './getBookEntry';

const useBookEntryQuery = (bookEntryTitle: string) => {
  return useQuery({
    queryKey: ['bookEntry', bookEntryTitle],
    queryFn: async () => await getBookEntry(bookEntryTitle),
  });
};

export default useBookEntryQuery;
