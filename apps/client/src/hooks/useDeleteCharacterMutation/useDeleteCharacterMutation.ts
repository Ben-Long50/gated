import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteCharacter from './deleteCharacter';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const useDeleteCharacterMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      return deleteCharacter(characterId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.removeQueries({
        queryKey: ['character', characterId],
      });

      navigate(-1);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteCharacterMutation;
