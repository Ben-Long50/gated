import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteMap from './deleteMap';
import { useNavigate } from 'react-router-dom';

const useDeleteMapMutation = (
  campaignId: number,
  mapId: number,
  setFormMessage: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      return deleteMap(campaignId, mapId);
    },
    onSuccess: () => {
      navigate(-1);

      queryClient.removeQueries({ queryKey: ['map', mapId] });
      return queryClient.invalidateQueries({
        queryKey: ['maps', campaignId],
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useDeleteMapMutation;
