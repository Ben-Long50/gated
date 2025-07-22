import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Character, CharacterStats } from 'src/types/character';
import { socket } from '../../../socket';
import editCharacterStat from './editCharacterStat';

const useResetCharacterStatMutation = () => {
  const queryClient = useQueryClient();

  const resetCharacterStatMutation = useMutation({
    mutationFn: async (data: { characterId: number; value: object }) =>
      await editCharacterStat(data.characterId, data.value),

    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ['character', data.characterId] });

      const prevCharacterData: Character | undefined = queryClient.getQueryData(
        ['character', data.characterId],
      );

      queryClient.setQueryData(
        ['character', data.characterId],
        (prev: Character) => ({
          ...prev,
          stats: {
            ...prev.stats,
            ...data.value,
          },
        }),
      );

      return { prevCharacterData };
    },

    onSuccess: (_, data, context) => {
      socket.emit('character', {
        characterId: data.characterId,
        campaignId: context.prevCharacterData?.campaignId,
      });
      return queryClient.invalidateQueries({
        queryKey: ['character', data.characterId],
      });
    },
    throwOnError: false,
  });
  return resetCharacterStatMutation;
};

export default useResetCharacterStatMutation;
