import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import addMap from './addMap';

const useAddMapMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mapId: number) => addMap(mapId, campaignId),
    onSuccess: (data) => {
      toast.success(data.message);

      if (data.map.userId) {
        queryClient.setQueryData(['authenticatedUser'], (prev) => ({
          ...prev,
          maps: [...prev.maps, { id: data.map.id }],
        }));
      }

      if (data.map.campaignId) {
        queryClient.setQueryData(
          ['campaign', data.character.campaignId],
          (prev) => ({
            ...prev,
            maps: [...prev.maps, { id: data.map.id }],
          }),
        );
      }
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useAddMapMutation;
