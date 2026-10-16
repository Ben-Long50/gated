import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteItemCondition from './deleteCharacterCondition';
import { socket } from 'src/socket';
import { Character } from '@gated/shared';

const useDeleteCharacterConditionMutation = (
  conditionId: number,
  characterId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return deleteItemCondition(conditionId, characterId);
    },

    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ['character', characterId] });

      const prevCharacterData: Character | undefined = queryClient.getQueryData(
        ['character', characterId],
      );

      queryClient.setQueryData(
        ['character', characterId],
        (prev: Character) => ({
          ...prev,
          conditions: prevCharacterData?.conditions.filter(
            (condition) => condition.id !== conditionId,
          ),
        }),
      );

      return { prevCharacterData };
    },

    onSuccess: (_, __, context) => {
      socket.emit('character', {
        characterId,
        campaignId: context.prevCharacterData?.campaignId,
      });
      return queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
    throwOnError: false,
  });
};

export default useDeleteCharacterConditionMutation;
