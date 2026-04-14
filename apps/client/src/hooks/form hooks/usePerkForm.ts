import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Perk } from 'src/types/perk';
import useAttributeTree from '../useAttributeTree';

const usePerkForm = (
  mutation: UseMutationResult<any, Error, any>,
  perk?: Perk,
) => {
  const { emptyAttributeTree } = useAttributeTree();

  const perkForm = useForm({
    defaultValues: {
      id: perk?.id || null,
      name: perk?.name || '',
      description: perk?.description || '',
      modifiers: perk?.modifiers || {},
      attributes: perk?.attributes || emptyAttributeTree,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return perkForm;
};

export default usePerkForm;
