import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCharacter from './createCharacter';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';

const useCreateCharacterMutation = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createCharacter(formData);
    },
    onSuccess: () => {
      toast('Successfully created character');

      return queryClient.invalidateQueries({
        queryKey: ['user', user.id],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCharacterMutation;
