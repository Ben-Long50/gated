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

      if (data.userId) {
        queryClient.setQueryData(['authenticatedUser'], (prev) => ({
          ...prev,
          characters: prev.characters.filter((c) => c.id !== characterId),
        }));
      }

      if (data.campaignId) {
        queryClient.setQueryData(['campaign', data.campaignId], (prev) => ({
          ...prev,
          characters: prev.characters.filter((c) => c.id !== characterId),
        }));
      }

      if (data.gangId) {
        queryClient.setQueryData(['gang', data.gangId], (prev) => ({
          ...prev,
          leaders: prev.leaders.filter((c) => c.id !== characterId),
          characters: prev.characters.filter((c) => c.id !== characterId),
        }));
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
