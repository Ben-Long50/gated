import { useMutation, useQueryClient } from '@tanstack/react-query';
import createMap from './createMap';
import { useNavigate } from 'react-router-dom';

const useCreateMapMutation = (
  apiUrl: string,
  campaignId: number,
  mapId?: number,
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: object) => {
      return createMap(campaignId, formData, apiUrl);
    },
    onSuccess: () => {
      navigate(-1);
      queryClient.invalidateQueries({
        queryKey: ['map', mapId],
      });
      return queryClient.invalidateQueries({
        queryKey: ['maps', campaignId],
        exact: false,
      });
    },
    throwOnError: false,
  });
};

export default useCreateMapMutation;
