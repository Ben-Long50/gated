import { useMutation, useQueryClient } from '@tanstack/react-query';
import editCurrentSanity from './editCurrentSanity';
import { useRef } from 'react';
import { Character } from 'src/types/character';
import { socket } from 'src/socket';

const useCurrentSanityMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

  return useMutation({
    mutationFn: (value: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateBuffer.current += value;

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;
          await editCurrentSanity(characterId, finalValue);
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
            currentSanity: prev.stats.currentSanity + value,
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
};

export default useCurrentSanityMutation;
