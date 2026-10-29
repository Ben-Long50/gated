import { useMutation, useQueryClient } from '@tanstack/react-query';
import rollInitiative from './rollInitiative';
import { RollData } from '@gated/shared';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { EncounterContext } from 'src/contexts/EncounterContext';

const useRollInitiativeMutation = (campaignId: number, encounterId: number) => {
  const { syncRolls } = useContext(EncounterContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rollData: RollData) =>
      rollInitiative(campaignId, encounterId, rollData),
    onSuccess: async (data) => {
      await syncRolls(data.rollResultData);
      toast.success(data.message);
      queryClient.setQueryData(['encounter', encounterId], data.encounter);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useRollInitiativeMutation;
