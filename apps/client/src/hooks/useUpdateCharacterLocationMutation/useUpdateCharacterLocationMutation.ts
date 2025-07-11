import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCharacterLocation from './updateCharacterLocation';

const useUpdateCharacterLocationMutation = (apiUrl: string, mapId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: { characterId: number; index: number }) => {
      return updateCharacterLocation(apiUrl, mapId, formData);
    },
    onSuccess: (data) => {
      console.log(data);

      queryClient.invalidateQueries({
        queryKey: ['map', mapId],
      });
      return queryClient.invalidateQueries({
        queryKey: ['character', data.characterId],
      });
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterLocationMutation;
