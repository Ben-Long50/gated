import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteErrorReport from './deleteErrorReport';

const useDeleteErrorReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (errorReportId: number) => {
      return deleteErrorReport(errorReportId);
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
