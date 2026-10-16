import { useMutation, useQueryClient } from '@tanstack/react-query';
import resetCharacterStat from './resetCharacterStat';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { Character, combineObjects } from '@gated/shared';

const useResetCharacterStatMutation = () => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(new Map());
  const timeoutRef = useRef(new Map());

  const resetCharacterStatMutation = useMutation({
    mutationFn: async (data: {
      characterId: number;
      stats: Record<string, number>;
    }) => {
      if (timeoutRef.current.get(data.characterId)) {
        clearTimeout(timeoutRef.current.get(data.characterId));
      }

      const prevBuffer = updateBuffer.current.get(data.characterId);

      updateBuffer.current.set(
        data.characterId,
        combineObjects(prevBuffer, data.stats),
      );

      return new Promise((resolve) => {
        const timer = setTimeout(async () => {
          const finalValue = updateBuffer.current.get(data.characterId);

          updateBuffer.current = new Map();

          const characterData = await resetCharacterStat(
            data.characterId,
            finalValue,
          );

          resolve(characterData);
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
          stats: { ...prev.stats, ...data.stats },
        }),
      );

      return { prevCharacterData };
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(
        ['character', data.character.id],
        data.character,
      );
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
  return resetCharacterStatMutation;
};

export default useResetCharacterStatMutation;
