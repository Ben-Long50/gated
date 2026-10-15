import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCharacterLevel from './updateCharacterLevel';
import { socket } from 'src/socket';
import { useRef } from 'react';
import { Character } from 'src/types/character';

const useUpdateCharacterLevelMutation = () => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useMutation({
    mutationFn: ({
      characterId,
      levelChange,
    }: {
      characterId: number;
      levelChange: number;
    }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const prevBuffer = updateBuffer.current;

      updateBuffer.current = prevBuffer + levelChange;

      return new Promise((resolve) => {
        const timer = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;

          await updateCharacterLevel(characterId, finalValue);

          resolve(finalValue);
        }, 1000);

        timeoutRef.current = timer;
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
          level: prevCharacterData
            ? prevCharacterData.level + data.levelChange
            : data.levelChange,
        }),
      );

      return { prevCharacterData };
    },

    onSuccess: (campaignId, data) => {
      socket.emit('character', { characterId: data.characterId, campaignId });
      return queryClient.invalidateQueries({
        queryKey: ['character', data.characterId],
      });
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterLevelMutation;
