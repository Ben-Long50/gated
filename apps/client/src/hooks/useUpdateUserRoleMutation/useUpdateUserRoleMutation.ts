import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from 'src/types/user';
import updateUserRole from './updateUserRole';

const useUpdateUserRoleMutation = (
  setFormMessage: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: Partial<User>) => {
      return updateUserRole(formData);
    },
    onSuccess: () => {
      setFormMessage('Role successfully updated');
      return queryClient.invalidateQueries({
        queryKey: ['account'],
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useUpdateUserRoleMutation;
