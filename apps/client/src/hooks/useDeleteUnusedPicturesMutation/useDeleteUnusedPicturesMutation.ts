import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import deleteUnusedPictures from './deleteUnusedPictures';

const useDeleteUnusedPicturesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: { type: string; count: number }) => {
      return deleteUnusedPictures(formData);
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

export default useDeleteUnusedPicturesMutation;
