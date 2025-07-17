import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import updateCharacter from './updateCharacter';
import { socket } from 'src/socket';

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
    onSuccess: (campaignId) => {
      navigate(-1);
      socket.emit('character', { characterId, campaignId });
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
