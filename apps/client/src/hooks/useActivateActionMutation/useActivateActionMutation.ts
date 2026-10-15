import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from '../../socket';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import activateAction from './activateAction';

const useActivateActionMutation = (itemId: number, actionId: number) => {
  const queryClient = useQueryClient();

  const editProfitsMutation = useMutation({
    mutationFn: async (value: boolean) => {
      await activateAction(actionId, value);
    },
    onMutate: (value) => {
      queryClient.cancelQueries({ queryKey: ['item', itemId] });

      const prevItemData: Item | undefined = queryClient.getQueryData([
        'item',
        itemId,
      ]);

      queryClient.setQueryData(['item', itemId], () => ({
        ...prevItemData,
        linkedActions: prevItemData?.linkedActions.map((action: Action) =>
          action.id === actionId ? { ...action, active: !value } : action,
        ),
      }));

      return { prevItemData };
    },

    onSuccess: (_, __, context) => {
      socket.emit('item', {
        itemId,
        campaignId:
          context.prevItemData?.characterInventory?.character.campaignId,
      });
      return queryClient.invalidateQueries({
        queryKey: ['item', itemId],
      });
    },
    throwOnError: false,
  });
  return editProfitsMutation;
};

export default useActivateActionMutation;
