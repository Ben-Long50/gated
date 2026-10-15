import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateUserRole from './updateUserRole';
import { toast } from 'react-toastify';

const useUpdateUserRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: { id: number; role: string }) => {
      return updateUserRole(formData);
    },
    onSuccess: (data, variables) => {
      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['user', variables.id],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useUpdateUserRoleMutation;
