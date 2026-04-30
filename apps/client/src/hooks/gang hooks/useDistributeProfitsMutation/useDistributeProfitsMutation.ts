import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import { useRef } from 'react';
import distributeProfits from './distributeProfits';
import { Gang } from 'src/types/gang';
import { toast } from 'react-toastify';

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

      return new Promise((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const finalValue = updateBuffer.current;
            updateBuffer.current = 0;

            const result = await distributeProfits(
              campaignId,
              gangId,
              characterId,
              finalValue,
            );

            resolve(result);
          } catch (error) {
            reject(error);
          }
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

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['gang', data.gang.id], data.gang);

      queryClient.setQueryData(
        ['character', data.character.id],
        data.character,
      );
    },
    onError: (data, __, context) => {
      toast.error(data.message);

      queryClient.setQueryData(
        ['gang', context?.prevGangData?.id],
        context?.prevGangData,
      );

      queryClient.setQueryData(
        ['character', context?.prevCharacterData?.id],
        context?.prevCharacterData,
      );
    },
    throwOnError: false,
  });
  return editProfitsMutation;
};

export default useDistributeProfitsMutation;
