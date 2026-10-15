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

      if (data.character.userId) {
        queryClient.invalidateQueries({ queryKey: ['authenticatedUser'] });
      }

      if (data.campaign) {
        queryClient.setQueryData(['campaign', data.campaign.id], data.campaign);
      }

      if (data.gang) {
        queryClient.setQueryData(['gang', data.gang.id], data.gang);
      }

      queryClient.removeQueries({
        queryKey: ['character', characterId],
      });

      navigate('/glam/characters');
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteCharacterMutation;
