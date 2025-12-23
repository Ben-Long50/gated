import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import deleteCharacter from './deleteCharacter';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const useDeleteCharacterMutation = (characterId?: string) => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteCharacter(characterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', user.id],
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
