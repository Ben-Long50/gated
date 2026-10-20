import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Map } from '@gated/shared';
import deleteCharacterLocation from './deleteCharacterLocation';
import { Character } from '@gated/shared';
import { toast } from 'react-toastify';

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

      queryClient.setQueryData(['map', mapId], (prev: Map) => ({
        ...prev,
        locations: prev.locations.filter(
          (location) => location.id !== data.locationId,
        ),
      }));
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['character', data.characterId], data.character);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteCharacterLocationMutation;
