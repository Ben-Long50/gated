import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import editProfits from './editGangProfits';
import { Gang } from 'src/types/gang';
import { toast } from 'react-toastify';

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

      return new Promise((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const finalValue = updateBuffer.current;
            updateBuffer.current = 0;

            const result = await editProfits(campaignId, gangId, finalValue);

            resolve(result);
          } catch (error) {
            reject(error);
          }
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

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['gang', data.gang.id], data.gang);
    },
    onError: (data, __, context) => {
      toast.error(data.message);

      queryClient.setQueryData(
        ['gang', context?.prevGangData?.id],
        context?.prevGangData,
      );
    },
    throwOnError: false,
  });
  return editProfitsMutation;
};

export default useGangProfitsMutation;
