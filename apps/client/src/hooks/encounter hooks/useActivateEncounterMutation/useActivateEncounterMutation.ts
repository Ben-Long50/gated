import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import activateEncounter from './activateEncounter';
import { Encounter } from 'src/types/encounter';

const useActivateEncounterMutation = (campaignId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (encounterId: number) => {
      return activateEncounter(campaignId, encounterId);
    },
    onMutate: (encounterId) => {
      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      queryClient.setQueryData(
        ['encounter', encounterId],
        (prev: Encounter) => ({
          ...prev,
          active: true,
        }),
      );

      return prevEncounter;
    },
    onSuccess: (_, __, encounter) => {
      if (encounter && encounter.mapId) {
        navigate(
          `/glam/campaigns/${campaignId}/maps/${encounter.mapId}/encounters/${encounterId}`,
        );
      }
    },
    throwOnError: false,
  });
};

export default useActivateEncounterMutation;
