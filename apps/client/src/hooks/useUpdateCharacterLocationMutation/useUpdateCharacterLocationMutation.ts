import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCharacterLocation from './updateCharacterLocation';
import { Location } from 'src/types/map';

const useUpdateCharacterLocationMutation = (mapId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: {
      characterId: number;
      locationId: number;
      index: number;
    }) => {
      return updateCharacterLocation(mapId, formData);
    },

    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ['location', data.locationId] });

      const prevItemData: Location | undefined = queryClient.getQueryData([
        'location',
        data.locationId,
      ]);

      if (mapId !== prevItemData?.mapId) {
        queryClient.removeQueries({ queryKey: ['location', data.locationId] });
      } else {
        queryClient.setQueryData(
          ['location', data.locationId],
          (prev: Location) => ({
            ...prev,
            index: data.index,
            characterId: data.characterId,
            mapId: mapId,
          }),
        );
      }

      return { prevItemData };
    },

    onSuccess: (data) => {
      if (data.location.mapId !== mapId) {
        queryClient.invalidateQueries({
          queryKey: ['map', data.location.mapId],
        });
      }
      return queryClient.invalidateQueries({
        queryKey: ['location', data.location.id],
      });
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterLocationMutation;
