import { useMutation, useQueryClient } from '@tanstack/react-query';
import modifyItem from './modifyItem';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useModifyItemMutation = (characterId: number, itemId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: object) => {
      return modifyItem(formData, characterId, itemId);
    },
    onSuccess: (data) => {
      toast.success(data.message0);
      navigate(-1);
      return queryClient.invalidateQueries({
        queryKey: ['item', itemId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useModifyItemMutation;
