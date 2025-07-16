import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import updateCharacter from './updateCharacter';

const useUpdateCharacterMutation = (
  characterId: number,
  setFormMessage: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return updateCharacter(formData, characterId);
    },
    onSuccess: () => {
      navigate(-1);
      return queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterMutation;
