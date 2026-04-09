import { useMutation, useQueryClient } from '@tanstack/react-query';
import createProperty from './createProperty';
import { toast } from 'react-toastify';

const useCreatePropertyMutation = (propertyId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createProperty(formData);
    },
    onSuccess: () => {
      const message = propertyId
        ? 'Property successfully updated'
        : 'Property successfully created';

      toast(message);

      return queryClient.invalidateQueries({
        queryKey: ['properties'],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useCreatePropertyMutation;
