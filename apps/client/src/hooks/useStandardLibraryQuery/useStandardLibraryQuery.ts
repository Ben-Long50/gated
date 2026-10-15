import { useQuery } from '@tanstack/react-query';
import getStandardLibrary from './getStandardLibrary';

const useStandardLibraryQuery = () => {
  return useQuery<any[]>({
    queryKey: ['standardLibrary'],
    queryFn: () => getStandardLibrary(),
    throwOnError: false,
  });
};

export default useStandardLibraryQuery;
