import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import addCharacter from './addCharacters';

const useAddCharacterMutation = (campaignId?: number, gangId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (characterId: number) =>
      addCharacter(characterId, campaignId, gangId),
    onSuccess: (data) => {
      toast.success(data.message);

      if (data.character.userId) {
        queryClient.setQueryData(['authenticatedUser'], (prev) => ({
          ...prev,
          characters: [...prev.characters, { id: data.character.id }],
        }));
      }

      if (data.character.campaignId) {
        queryClient.setQueryData(
          ['campaign', data.character.campaignId],
          (prev) => ({
            ...prev,
            characters: [...prev.characters, { id: data.character.id }],
          }),
        );
      }

      if (data.character.gangId) {
        queryClient.setQueryData(['gang', data.character.gangId], (prev) => ({
          ...prev,
          characters: [...prev.characters, { id: data.character.id }],
        }));
      }
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useAddCharacterMutation;
