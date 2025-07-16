import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCharacter from './createCharacter';

const useCreateCharacterMutation = (
  setFormMessage: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createCharacter(formData);
    },
    onSuccess: () => {
      setFormMessage('Successfully created character');
      return queryClient.invalidateQueries({
        queryKey: ['characters'],
        exact: false,
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useCreateCharacterMutation;
