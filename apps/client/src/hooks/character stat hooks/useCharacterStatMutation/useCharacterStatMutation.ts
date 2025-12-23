import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Character, CharacterStats } from 'src/types/character';
import { useRef } from 'react';
import { socket } from '../../../socket';
import editCharacterStat from './editCharacterStat';

const useCharacterStatMutation = () => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(new Map());
  const timeoutRef = useRef(new Map());

  const editCharacterStatMutation = useMutation({
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

          console.log(finalValue);

          await editCharacterStat(data.characterId, data.stat, finalValue);

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

      let adjustedValue = prevCharacterData.stats[data.stat] + data.value;

      if (adjustedValue < 0) {
        adjustedValue = 0;
      }

      switch (data.stat) {
        case 'currentHealth':
          if (
            prevCharacterData?.stats.maxHealth &&
            adjustedValue > prevCharacterData?.stats.maxHealth
          ) {
            adjustedValue = prevCharacterData?.stats.maxHealth;
          }
          break;
        case 'currentSanity':
          if (
            prevCharacterData?.stats.maxSanity &&
            adjustedValue > prevCharacterData?.stats.maxSanity
          ) {
            adjustedValue = prevCharacterData?.stats.maxSanity;
          }
          break;
        default:
          break;
      }

      queryClient.setQueryData(
        ['character', data.characterId],
        (prev: Character) => ({
          ...prev,
          stats: {
            ...prev.stats,
            [data.stat]: adjustedValue,
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
  return editCharacterStatMutation;
};

export default useCharacterStatMutation;
