import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import activateEncounter from './activateEncounter';
import { toast } from 'react-toastify';

const useActivateEncounterMutation = (campaignId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (encounterId: number) => {
      return activateEncounter(campaignId, encounterId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      console.log(data);

      queryClient.setQueryData(
        ['encounter', data.encounter.id],
        data.encounter,
      );

      navigate(
        `/glam/campaigns/${campaignId}/maps/${data.encounter.mapId}/encounters/${data.encounter.id}/modal/initiative`,
      );
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useActivateEncounterMutation;
