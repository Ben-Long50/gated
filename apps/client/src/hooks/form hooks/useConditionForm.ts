import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Condition } from 'src/types/condition';
import { filterFormData } from './constructFormData';

const useConditionForm = (
  mutation: UseMutationResult<any, Error, object>,
  condition?: Condition,
) => {
  const conditionForm = useForm({
    defaultValues: {
      id: condition?.id ?? null,
      name: condition?.name ?? '',
      type: condition?.conditionType ?? '',
      description: condition?.description ?? '',
    },
    onSubmit: async ({ value }) => {
      const filteredData = filterFormData(value);

      await mutation.mutate(filteredData);
    },
  });

  return conditionForm;
};

export default useConditionForm;
