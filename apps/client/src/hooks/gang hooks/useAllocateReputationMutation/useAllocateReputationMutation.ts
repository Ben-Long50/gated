import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Gang } from 'src/types/gang';
import allocateReputation from './allocateReputation';
import { toast } from 'react-toastify';

const useAllocateReputationMutation = (campaignId: number, gangId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      sessionId: number;
      bonus: { value: number; description: string }[];
    }) => {
      return allocateReputation(campaignId, gangId, data);
    },
    onMutate(value) {
      queryClient.cancelQueries({ queryKey: ['gang', gangId] });

      const prevGangData: Gang | undefined = queryClient.getQueryData([
        'gang',
        gangId,
      ]);

      if (prevGangData) {
        queryClient.setQueryData(['gang', gangId], () => ({
          ...prevGangData,
          gangSessionBonuses: prevGangData.gangSessionBonuses.map((bonus) =>
            bonus.gangId === gangId && bonus.sessionId === value.sessionId
              ? { ...bonus, reputationBonus: value.bonus }
              : bonus,
          ),
        }));
      }

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
};

export default useAllocateReputationMutation;
