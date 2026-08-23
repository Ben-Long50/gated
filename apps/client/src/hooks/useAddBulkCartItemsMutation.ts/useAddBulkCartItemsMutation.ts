import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import addBulkCartItems from './addBulkCartItems';

const useAddBulkCartItemsMutation = (characterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: {
      quantity: number;
      rarities: string[];
      itemTypes: string[];
    }) => addBulkCartItems(characterId, formData),
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['character', characterId], data.character);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useAddBulkCartItemsMutation;
