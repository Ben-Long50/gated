import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData } from './constructFormData';

const useBulkItemForm = (mutation: UseMutationResult<any, Error, any>) => {
  const bulkItemForm = useForm({
    defaultValues: {
      quantity: 1,
      rarities: [],
      itemTypes: [],
    },
    onSubmit: async ({ value }) => {
      const filteredData = filterFormData(value);

      await mutation.mutate(filteredData);
    },
  });

  return bulkItemForm;
};

export default useBulkItemForm;
