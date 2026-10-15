import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from 'src/types/user';
import updateAccount from './updateAccount';
import { toast } from 'react-toastify';

const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: Partial<User>) => {
      return updateAccount(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      return queryClient.invalidateQueries({
        queryKey: ['account'],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useUpdateAccountMutation;
