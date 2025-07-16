import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import deleteCharacter from './deleteCharacter';

const useDeleteCharacterMutation = (characterId?: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteCharacter(characterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['characters'],
        exact: false,
      });
      navigate('/glam/characters');
    },
    onError: () => {
      console.error('Error creating character');
    },
    throwOnError: false,
  });
};

export default useDeleteCharacterMutation;
