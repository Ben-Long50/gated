import { useMutation, useQueryClient } from '@tanstack/react-query';
import createTemplateCharacter from './createTemplateCharacter';
import { toast } from 'react-toastify';

const useCreateTemplateCharacterMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return createTemplateCharacter(characterId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(
        ['character', data.character.id],
        data.character,
      );

      return queryClient.invalidateQueries({
        queryKey: ['user', data.character.userId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateTemplateCharacterMutation;
