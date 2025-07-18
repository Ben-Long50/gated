import { useMutation, useQueryClient } from '@tanstack/react-query';
import editCurrentHealth from './editCurrentHealth';
import { Character } from 'src/types/character';
import { useRef } from 'react';
import { socket } from '../../socket';

const useCurrentHealthMutation = () => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

  const editCurrentHealthMutation = useMutation({
    mutationFn: async (data: { characterId: number; value: number }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateBuffer.current += data.value;

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;
          await editCurrentHealth(data.characterId, finalValue);
          resolve(finalValue);
        }, 1000);
      });
    },

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
            currentHealth: prev.stats.currentHealth + data.value,
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
  return editCurrentHealthMutation;
};

export default useCurrentHealthMutation;
