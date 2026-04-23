import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Item } from 'src/types/item';

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
      if (item) {
        await itemMutation.mutate(value.conditions);
      }
      if (character) {
        await characterMutation.mutate(value.conditions);
      }
    },
  });

  return conditionLinkForm;
};

export default useConditionLinkForm;
