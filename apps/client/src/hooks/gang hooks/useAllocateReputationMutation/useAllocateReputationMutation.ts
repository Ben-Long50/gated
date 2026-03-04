import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Gang } from 'src/types/gang';
import { useNavigate } from 'react-router-dom';
import allocateReputation from './allocateReputation';

const useAllocateReputationMutation = (campaignId: number, gangId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: {
      sessionId: number;
      bonus: { value: number; description: string }[];
    }) => {
      return allocateReputation(campaignId, gangId, data);
    },
    onMutate(value) {
      queryClient.cancelQueries({ queryKey: ['gang', gangId] });

      const prevGang = queryClient.getQueryData(['gang', gangId]) as Gang;

      if (prevGang) {
        queryClient.setQueryData(['gang', gangId], () => ({
          ...prevGang,
          gangSessionBonuses: prevGang.gangSessionBonuses.map((bonus) =>
            bonus.gangId === gangId && bonus.sessionId === value.sessionId
              ? { ...bonus, reputationBonus: value.bonus }
              : bonus,
          ),
        }));
      }

      return prevGang;
    },
    onSuccess: () => {
      navigate('..');
      return queryClient.invalidateQueries({
        queryKey: ['gang', gangId],
      });
    },
    throwOnError: false,
  });
};

export default useAllocateReputationMutation;
