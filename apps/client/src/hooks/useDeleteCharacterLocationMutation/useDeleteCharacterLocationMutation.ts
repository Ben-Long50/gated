import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Map } from 'src/types/map';
import deleteCharacterLocation from './deleteCharacterLocation';

const useDeleteCharacterLocationMutation = (mapId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      locationId,
    }: {
      characterId: number;
      locationId: number;
    }) => {
      return deleteCharacterLocation(characterId);
    },
    onMutate: (data) => {
      queryClient.removeQueries({ queryKey: ['location', data.locationId] });

      const prevMap = queryClient.getQueriesData({ queryKey: ['map', mapId] });

      queryClient.setQueryData(['map', mapId], (prev: Map) => ({
        ...prev,
        locations: prev.locations.filter(
          (location) => location.id !== data.locationId,
        ),
      }));

      return { prevMap };
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['map', mapId] });
    },

    throwOnError: false,
  });
};

export default useDeleteCharacterLocationMutation;
