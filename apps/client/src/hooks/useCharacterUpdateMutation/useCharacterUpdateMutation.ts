import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCharacter from './updateCharacter';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const useUpdateCharacterMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: object) => {
      return updateCharacter(formData, characterId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['character', characterId], data.character);

      if (data.campaignId) {
        queryClient.invalidateQueries({
          queryKey: ['campaign', data.campaignId],
        });
      }

      navigate(-1);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useUpdateCharacterMutation;
