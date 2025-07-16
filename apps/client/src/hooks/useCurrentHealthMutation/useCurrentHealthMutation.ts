import { useMutation, useQueryClient } from '@tanstack/react-query';
import editCurrentHealth from './editCurrentHealth';
import { Character } from 'src/types/character';
import { useRef } from 'react';
import { socket } from '../../socket';

const useCurrentHealthMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

  const editCurrentHealthMutation = useMutation({
    mutationFn: async (value: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateBuffer.current += value;

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;
          await editCurrentHealth(characterId, finalValue);
          resolve(finalValue);
        }, 1000);
      });
    },

    onMutate: (value) => {
      queryClient.cancelQueries({ queryKey: ['character', characterId] });

      const prevCharacterData: Character | undefined = queryClient.getQueryData(
        ['character', characterId],
      );

      queryClient.setQueryData(
        ['character', characterId],
        (prev: Character) => ({
          ...prev,
          stats: {
            ...prev.stats,
            currentHealth: prev.stats.currentHealth + value,
          },
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
  return editCurrentHealthMutation;
};

export default useCurrentHealthMutation;
