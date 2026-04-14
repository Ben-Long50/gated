import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import updateCharacter from './updateCharacter';
import { socket } from 'src/socket';
import { toast } from 'react-toastify';

const useUpdateCharacterMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return updateCharacter(formData, characterId);
    },
    onSuccess: (campaignId) => {
      toast('Character successfully updated');

      navigate(-1);

      socket.emit('character', { characterId, campaignId });

      return queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterMutation;
