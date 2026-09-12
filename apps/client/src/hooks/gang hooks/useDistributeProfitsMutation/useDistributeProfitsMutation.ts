import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import { useRef } from 'react';
import distributeProfits from './distributeProfits';
import { Gang } from 'src/types/gang';
import { toast } from 'react-toastify';

const useDistributeProfitsMutation = (campaignId: number, gangId: number) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(0);

  const distributionMapRef = useRef(new Map());

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

      const map = distributionMapRef.current;
      const entry = map.get(characterId);

      if (entry) {
        map.set(characterId, value + entry);
      } else {
        map.set(characterId, value);
      }

      distributionMapRef.current = map;

      return new Promise((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const distributions = Array.from(distributionMapRef.current);

            distributionMapRef.current = new Map();

            const result = await distributeProfits(
              campaignId,
              gangId,
              distributions,
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
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['gang', data.gang.id], data.gang);

      for (const character of data.characters) {
        queryClient.setQueryData(['character', character.id], character);
      }
    },
    onError: (data) => {
      toast.error(data.message);

      const distributions = Array.from(distributionMapRef.current);

      distributions.forEach(([characterId, value]) =>
        queryClient.setQueryData(['character', characterId], (prev) => ({
          ...prev,
          profits: prev.profits - value,
        })),
      );

      const value = distributions.reduce((sum, [_, value]) => sum + value, 0);

      queryClient.setQueryData(['gang', gangId], (prev) => ({
        ...prev,
        profits: prev.profits + value,
      }));
    },
    throwOnError: false,
  });
  return editProfitsMutation;
};

export default useDistributeProfitsMutation;
