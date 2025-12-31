import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Character, CharacterStats } from 'src/types/character';
import { socket } from '../../../socket';
import resetCharacterStat from './resetCharacterStat';
import { useRef } from 'react';

const useResetCharacterStatMutation = () => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(new Map());
  const timeoutRef = useRef(new Map());

  const resetCharacterStatMutation = useMutation({
    mutationFn: async (data: {
      characterId: number;
      stat: keyof CharacterStats;
      value: number;
    }) => {
      if (timeoutRef.current.get(data.characterId)) {
        clearTimeout(timeoutRef.current.get(data.characterId));
      }

      const prevBuffer = updateBuffer.current.get(data.characterId);

      updateBuffer.current.set(
        data.characterId,
        prevBuffer && prevBuffer[data.stat]
          ? {
              ...prevBuffer,
              [data.stat]: prevBuffer[data.stat] + data.value,
            }
          : {
              ...prevBuffer,
              [data.stat]: data.value,
            },
      );

      return new Promise((resolve) => {
        const timer = setTimeout(async () => {
          const finalValue = updateBuffer.current.get(data.characterId);

          updateBuffer.current = new Map();

          await resetCharacterStat(data.characterId, data.stat, finalValue);

          resolve(finalValue);
        }, 1000);

        timeoutRef.current.set(data.characterId, timer);
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
            [data.stat]: data.value,
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
