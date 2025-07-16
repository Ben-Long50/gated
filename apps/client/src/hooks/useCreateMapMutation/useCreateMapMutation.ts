import { useMutation, useQueryClient } from '@tanstack/react-query';
import createMap from './createMap';
import { useNavigate } from 'react-router-dom';

const useCreateMapMutation = (campaignId: number, mapId?: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createMap(campaignId, formData);
    },
    onSuccess: () => {
      navigate(-1);
      queryClient.invalidateQueries({
        queryKey: ['map', mapId],
      });
      return queryClient.invalidateQueries({
        queryKey: ['maps', campaignId],
      });
    },
    throwOnError: false,
  });
};

export default useCreateMapMutation;
