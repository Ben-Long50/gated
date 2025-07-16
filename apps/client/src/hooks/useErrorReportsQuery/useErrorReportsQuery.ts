import { useQuery } from '@tanstack/react-query';
import getErrorReports from './getErrorReports';

const useErrorReportsQuery = () => {
  return useQuery({
    queryKey: ['errorReports'],
    queryFn: async () => await getErrorReports(),
    throwOnError: true,
  });
};

export default useErrorReportsQuery;
