import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Map } from '@gated/shared';
import deleteCharacterLocation from './deleteCharacterLocation';
import { Character } from '@gated/shared';

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

      queryClient.setQueryData(
        ['character', data.characterId],
        (prev: Character) => ({
          ...prev,
          location: null,
          locationId: null,
        }),
      );

      const prevMap = queryClient.getQueriesData({ queryKey: ['map', mapId] });

      queryClient.setQueryData(['map', mapId], (prev: Map) => ({
        ...prev,
        locations: prev.locations.filter(
          (location) => location.id !== data.locationId,
        ),
      }));

      return { prevMap };
    },
    onSuccess: (_, value) => {
      queryClient.invalidateQueries({
        queryKey: ['character', value.characterId],
      });
      return queryClient.invalidateQueries({ queryKey: ['map', mapId] });
    },

    throwOnError: false,
  });
};

export default useDeleteCharacterLocationMutation;
