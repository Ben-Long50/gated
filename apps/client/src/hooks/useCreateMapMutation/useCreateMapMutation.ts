import { useMutation, useQueryClient } from '@tanstack/react-query';
import createMap from './createMap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapInput } from '@gated/shared';
import { User } from '@gated/shared';

const useCreateMapMutation = (mapId?: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: MapInput) => {
      return createMap(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      const prevAuthUser: User | undefined = queryClient.getQueryData([
        'authenticatedUser',
      ]);

      if (prevAuthUser) {
        const prevMaps = prevAuthUser.maps.filter(
          (map) => map.id !== data.map.id,
        );

        queryClient.setQueryData(['authenticatedUser'], {
          ...prevAuthUser,
          maps: [...prevMaps, { id: data.map.id }],
        });
      }

      queryClient.setQueryData(['map', mapId], data.map);
      navigate(`/glam/maps/${data.map.id}`);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateMapMutation;
