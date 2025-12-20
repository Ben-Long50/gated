import { useMutation, useQueryClient } from '@tanstack/react-query';
import createTemplateCharacter from './createTemplateCharacter';

const useCreateTemplateCharacterMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return createTemplateCharacter(characterId);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['characters'],
        exact: false,
      });
    },
    throwOnError: false,
  });
};

export default useCreateTemplateCharacterMutation;
