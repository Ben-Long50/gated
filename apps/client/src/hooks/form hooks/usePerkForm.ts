import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Perk } from 'src/types/perk';
import useAttributeTree from '../useAttributeTree';
import { filterFormData } from './constructFormData';

const usePerkForm = (
  mutation: UseMutationResult<any, Error, any>,
  perk?: Perk,
) => {
  const { emptyAttributeTree } = useAttributeTree();

  const perkForm = useForm({
    defaultValues: {
      id: perk?.id ?? null,
      name: perk?.name ?? '',
      description: perk?.description ?? '',
      type: perk?.type ?? 'character',
      modifiers: perk?.modifiers ?? {},
      attributes: perk?.attributes ?? emptyAttributeTree,
      actionIds: perk?.actions.map((action) => action.id) ?? ([] as number[]),
    },
    onSubmit: async ({ value }) => {
      const filteredData = filterFormData(value);

      await mutation.mutate(filteredData);
    },
  });

  return perkForm;
};

export default usePerkForm;
