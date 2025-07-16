import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteBookSection from './deleteErrorReport';

const useDeleteErrorReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (errorReportId: number) => {
      return deleteBookSection(errorReportId);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['errorReports'],
        exact: false,
      });
    },
    throwOnError: false,
  });
};

export default useDeleteErrorReportMutation;
