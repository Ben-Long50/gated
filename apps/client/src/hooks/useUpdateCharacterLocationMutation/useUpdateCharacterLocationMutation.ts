import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCharacterLocation from './updateCharacterLocation';
import { Location, Map } from '@gated/shared';
import { toast } from 'react-toastify';

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

      const prevMapData: Map | undefined = queryClient.getQueryData([
        'map',
        mapId,
      ]);

      const locationId = data.locationId ?? 0;

      queryClient.setQueryData(
        ['location', locationId],
        prevLocationData
          ? {
              ...prevLocationData,
              mapId,
              characterId: data.characterId,
              row: data.row,
              col: data.col,
            }
          : {
              id: 0,
              mapId,
              characterId: data.characterId,
              row: data.row,
              col: data.col,
            },
      );

      if (prevMapData) {
        queryClient.setQueryData(['map', mapId], {
          ...prevMapData,
          locations: [
            ...prevMapData.locations.filter(
              (location) => location.id !== locationId,
            ),
            {
              id: locationId,
            },
          ],
        });
      }

      return { prevLocationData, prevMapData };
    },

    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ['location', 0] });
      toast.success(data.message);

      queryClient.setQueryData(
        ['character', data.character.id],
        data.character,
      );
      queryClient.setQueryData(['location', data.location.id], data.location);
      queryClient.setQueryData(['map', data.map.id], data.map);
    },
    onError: (data, variables, context) => {
      queryClient.removeQueries({ queryKey: ['location', 0] });
      queryClient.setQueryData(['map', mapId], context?.prevMapData);
      queryClient.setQueryData(
        ['location', variables.locationId],
        context?.prevLocationData,
      );

      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterLocationMutation;
