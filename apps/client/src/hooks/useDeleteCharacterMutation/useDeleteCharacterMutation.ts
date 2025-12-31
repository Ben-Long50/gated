import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import deleteCharacter from './deleteCharacter';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { socket } from 'src/socket';

const useDeleteCharacterMutation = (characterId?: string) => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteCharacter(characterId);
    },
    onSuccess: () => {
      if (campaignId) {
        queryClient.invalidateQueries({
          queryKey: ['campaign', Number(campaignId)],
        });
        socket.emit('campaign', Number(campaignId));
      }
      queryClient.invalidateQueries({
        queryKey: ['user', user.id],
      });
    },
    onError: () => {
      console.error('Error creating character');
    },
    throwOnError: false,
  });
};

export default useDeleteCharacterMutation;
