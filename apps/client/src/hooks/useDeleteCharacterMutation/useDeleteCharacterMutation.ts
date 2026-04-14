import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import deleteCharacter from './deleteCharacter';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { socket } from 'src/socket';
import { toast } from 'react-toastify';

const useDeleteCharacterMutation = (characterId: number) => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return deleteCharacter(characterId);
    },
    onSuccess: () => {
      toast('Character successfully deleted');
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
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteCharacterMutation;
