import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Item } from 'src/types/item';
import { filterFormData } from './filterFormData';

const useConditionLinkForm = (
  characterMutation: UseMutationResult<any, Error, any>,
  itemMutation: UseMutationResult<any, Error, any>,
  character?: Item,
  item?: Item,
) => {
  const conditionLinkForm = useForm({
    defaultValues: {
      conditions:
        item?.conditions.map((condition) => ({
          conditionId: condition.conditionId,
          stacks: condition.stacks ?? null,
        })) ||
        character?.conditions.map((condition) => ({
          conditionId: condition.conditionId,
          stacks: condition.stacks ?? null,
        })) ||
        ([] as { conditionId: number; stacks: number | null }[]),
    },
    onSubmit: async ({ value }) => {
      const filteredData = filterFormData(value.conditions);

      if (item) {
        await itemMutation.mutate(filteredData);
      }
      if (character) {
        await characterMutation.mutate(filteredData);
      }
    },
  });

  return conditionLinkForm;
};

export default useConditionLinkForm;
