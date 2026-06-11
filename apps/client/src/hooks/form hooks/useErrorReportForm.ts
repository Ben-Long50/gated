import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { ErrorReport } from 'src/types/errorReport';
import { filterFormData } from './constructFormData';

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
      const filtereData = filterFormData(value);

      await mutation.mutate(filtereData);
    },
  });

  return errorReportForm;
};

export default useErrorReportForm;
