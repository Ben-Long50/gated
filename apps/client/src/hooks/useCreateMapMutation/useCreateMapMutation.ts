import { useMutation, useQueryClient } from '@tanstack/react-query';
import createMap from './createMap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useCreateMapMutation = (campaignId: number, mapId?: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createMap(campaignId, formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      navigate(-1);
      queryClient.invalidateQueries({
        queryKey: ['map', mapId],
      });
      return queryClient.invalidateQueries({
        queryKey: ['maps', campaignId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateMapMutation;
