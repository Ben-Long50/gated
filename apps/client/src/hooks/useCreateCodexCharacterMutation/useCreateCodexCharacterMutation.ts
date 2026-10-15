import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import createCodexCharacter from './createCodexCharacter';
import { useNavigate } from 'react-router-dom';

const useCreateCodexCharacterMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: object) => {
      return createCodexCharacter(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ['codexCharacters'] });

      navigate(`../${data.character.id}`);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCodexCharacterMutation;
