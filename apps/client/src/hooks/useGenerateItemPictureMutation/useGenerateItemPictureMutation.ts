import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import generateItemPicture from './generateItemPicture';

const useGenerateItemPictureMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: string) => {
      return generateItemPicture(prompt);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['authenticatedUser'] });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useGenerateItemPictureMutation;
