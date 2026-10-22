import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData } from './filterFormData';

const useInitiativeForm = (
  mutation: UseMutationResult<any, Error, any>,
  characterIds: number[],
) => {
  const accountForm = useForm({
    defaultValues: {
      rollData: new Map(
        characterIds.map((id) => [id, { modifiers: [], extraDice: 0 }]),
      ),
    },
    onSubmit: ({ value }) => {
      const filteredData = filterFormData(value);

      mutation.mutate(filteredData);
    },
  });

  return accountForm;
};

export default useInitiativeForm;
