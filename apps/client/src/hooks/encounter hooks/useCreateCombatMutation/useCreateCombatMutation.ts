import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCombat from './createCombat';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useCreateCombatMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: {
      id?: number;
      combatPhase?: string;
      mapId: number;
    }) => createCombat(campaignId, formData),
    onSuccess: (data) => {
      toast.success(data.message);

      navigate('..?type=pending');

      queryClient.setQueryData(
        ['encounter', data.encounter.id],
        data.encounter,
      );
      queryClient.setQueryData(['campaign', campaignId], (prev) => ({
        ...prev,
        encounters: [...prev.encounters, { id: data.encounter.id }],
      }));
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCombatMutation;
