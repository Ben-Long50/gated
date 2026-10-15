import { useMutation, useQueryClient } from '@tanstack/react-query';
import createProperty from './createProperty';
import { toast } from 'react-toastify';

const useCreatePropertyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createProperty(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['properties'],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreatePropertyMutation;
