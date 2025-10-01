import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCharacterLocation from './updateCharacterLocation';
import { Location } from 'src/types/map';
import { socket } from 'src/socket';

const useUpdateCharacterLocationMutation = (mapId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      characterId: number;
      locationId: number;
      index: number;
    }) => {
      return updateCharacterLocation(mapId, data);
    },

    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ['location', data.locationId] });

      const prevLocationData: Location | undefined = queryClient.getQueryData([
        'location',
        data.locationId,
      ]);

      if (prevLocationData) {
        if (mapId !== prevLocationData?.mapId) {
          queryClient.removeQueries({
            queryKey: ['location', data.locationId],
          });
        } else {
          queryClient.setQueryData(
            ['location', data.locationId],
            (prev: Location) => ({ ...prev, index: data.index }),
          );
        }
      }

      return { prevLocationData };
    },

    onSuccess: (data, __, context) => {
      socket.emit('location', {
        locationId: data.location.id,
        campaignId: context.prevLocationData?.character.campaignId,
      });
      queryClient.invalidateQueries({
        queryKey: ['map', mapId],
      });
      return queryClient.invalidateQueries({
        queryKey: ['location', data.location.id],
      });
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterLocationMutation;
