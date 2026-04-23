import { useMutation, useQueryClient } from '@tanstack/react-query';
import createItemCondition from './createItemCondition';
import { Item } from 'src/types/item';
import { useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import { toast } from 'react-toastify';

const useCreateItemConditionMutation = (
  itemId: number,
  characterId: number,
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return useMutation({
    mutationFn: (
      formData: { conditionId: number; stacks: number | null }[],
    ) => {
      return createItemCondition(itemId, formData);
    },

    onMutate: (formData) => {
      queryClient.cancelQueries({ queryKey: ['item', itemId] });

      const prevItemData: Item | undefined = queryClient.getQueryData([
        'item',
        itemId,
      ]);

      const conditionData = formData
        .map((condition) => ({
          condition: queryClient.getQueryData([
            'condition',
            condition.conditionId,
          ]),
          stacks: condition.stacks,
          characterId,
        }))
        .sort((a, b) => a.condition.name.localeCompare(b.condition.name));

      queryClient.setQueryData(['item', itemId], (prev: Item) => ({
        ...prev,
        conditions: conditionData,
      }));

      return { prevItemData };
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['item', data.item.id], data.item);

      if (backgroundPath) {
        navigate(backgroundPath, { replace: true });
      }
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateItemConditionMutation;
