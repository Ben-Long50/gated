import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import createCodexCharacter from './createCodexCharacter';

const useCreateCodexCharacterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createCodexCharacter(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ['codexCharacters'] });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCodexCharacterMutation;
