import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import { useRef } from 'react';
import { socket } from '../../../socket';
import distributeProfits from './distributeProfits';
import { Gang } from 'src/types/gang';

const useDistributeProfitsMutation = (campaignId: number, gangId: number) => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

  const editProfitsMutation = useMutation({
    mutationFn: async ({
      characterId,
      value,
    }: {
      characterId: number;
      value: number;
    }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateBuffer.current += value;

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;
          await distributeProfits(campaignId, gangId, characterId, finalValue);
          resolve(finalValue);
        }, 1000);
      });
    },

    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ['character', data.characterId] });
      queryClient.cancelQueries({ queryKey: ['gang', gangId] });

      const prevGangData: Gang | undefined = queryClient.getQueryData([
        'gang',
        gangId,
      ]);

      queryClient.setQueryData(['gang', gangId], () => ({
        ...prevGangData,
        profits:
          typeof prevGangData?.profits === 'number'
            ? prevGangData?.profits - data.value
            : data.value,
      }));

      const prevCharacterData: Character | undefined = queryClient.getQueryData(
        ['character', data.characterId],
      );

      queryClient.setQueryData(['character', data.characterId], () => ({
        ...prevCharacterData,
        profits:
          typeof prevCharacterData?.profits === 'number'
            ? prevCharacterData?.profits + data.value
            : data.value,
      }));

      return { prevCharacterData, prevGangData };
    },

    onSuccess: (_, data, context) => {
      socket.emit('character', {
        characterId: data.characterId,
        campaignId: context.prevCharacterData?.campaignId,
      });
      queryClient.invalidateQueries({
        queryKey: ['gang', gangId],
      });
      return queryClient.invalidateQueries({
        queryKey: ['character', data.characterId],
      });
    },
    throwOnError: false,
  });
  return editProfitsMutation;
};

export default useDistributeProfitsMutation;
