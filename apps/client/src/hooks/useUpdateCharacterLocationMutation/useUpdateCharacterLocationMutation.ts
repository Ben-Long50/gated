import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCharacterLocation from './updateCharacterLocation';
import { Location, Map } from 'src/types/map';
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
          queryClient.setQueryData(
            ['location', data.locationId],
            (prev: Location) => ({
              ...prev,
              mapId,
              row: data.row,
              col: data.col,
            }),
          );
        } else {
          queryClient.setQueryData(
            ['location', data.locationId],
            (prev: Location) => ({ ...prev, row: data.row, col: data.col }),
          );
        }
      } else {
        queryClient.setQueryData(['location', 'temp'], {
          mapId,
          id: 0,
          characterId: data.characterId,
          row: data.row,
          col: data.col,
        });
        queryClient.setQueryData(['map', mapId], (prev: Map) => ({
          ...prev,
          locations: [...prev.locations, { id: 'temp' }],
        }));
      }

      return { prevLocationData };
    },

    onSuccess: (_, value, context) => {
      if (mapId !== context.prevLocationData?.mapId) {
        queryClient.invalidateQueries({
          queryKey: ['map', mapId],
        });
        queryClient.invalidateQueries({
          queryKey: ['character', value.characterId],
        });
      }
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterLocationMutation;
