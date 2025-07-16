import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from 'src/types/user';
import updateAccount from './updateAccount';

const useUpdateAccountMutation = (
  setFormMessage: (message: string) => void,
  setErrors: (errors: string[]) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: Partial<User>) => {
      return updateAccount(formData);
    },
    onSuccess: () => {
      setFormMessage('Account successfully updated');
      return queryClient.invalidateQueries({
        queryKey: ['account'],
      });
    },
    onError: (error: string[]) => {
      setErrors(error);
    },
    throwOnError: false,
  });
};

export default useUpdateAccountMutation;
