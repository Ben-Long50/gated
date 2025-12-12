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
      row: number;
      col: number;
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
            (prev: Location) => ({ ...prev, row: data.row, col: data.col }),
          );
        }
      }

      return { prevLocationData };
    },

    onSuccess: (data, value, context) => {
      socket.emit('location', {
        locationId: data.location.id,
        campaignId: context.prevLocationData?.character.campaignId,
      });
      queryClient.invalidateQueries({
        queryKey: ['map', mapId],
      });
      queryClient.invalidateQueries({
        queryKey: ['character', value.characterId],
      });
      return queryClient.invalidateQueries({
        queryKey: ['location', data.location.id],
      });
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterLocationMutation;
