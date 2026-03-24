import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { socket } from '../../../socket';
import editProfits from './editGangProfits';
import { Gang } from 'src/types/gang';

const useGangProfitsMutation = (campaignId: number, gangId: number) => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

  const editProfitsMutation = useMutation({
    mutationFn: async (value: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateBuffer.current += value;

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;
          await editProfits(campaignId, gangId, finalValue);
          resolve(finalValue);
        }, 1000);
      });
    },

    onMutate: (value) => {
      queryClient.cancelQueries({ queryKey: ['gang', gangId] });

      const prevGangData: Gang | undefined = queryClient.getQueryData([
        'gang',
        gangId,
      ]);

      queryClient.setQueryData(['gang', gangId], () => ({
        ...prevGangData,
        profits: prevGangData?.profits ? prevGangData?.profits + value : value,
      }));

      return { prevGangData };
    },

    onSuccess: (_, __, context) => {
      socket.emit('gang', {
        gangId,
        campaignId: context.prevGangData?.campaignId,
      });
      return queryClient.invalidateQueries({
        queryKey: ['gang', gangId],
      });
    },
    throwOnError: false,
  });
  return editProfitsMutation;
};

export default useGangProfitsMutation;
