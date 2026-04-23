import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { ErrorReport } from 'src/types/errorReport';

const useErrorReportForm = (
  mutation: UseMutationResult<any, Error, any>,
  errorReport?: ErrorReport,
) => {
  const errorReportForm = useForm({
    defaultValues: {
      title: errorReport?.title ?? '',
      content: errorReport?.content ?? '',
    },
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return errorReportForm;
};

export default useErrorReportForm;
