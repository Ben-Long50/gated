import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCharacter from './createCharacter';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { User } from 'src/types/user';

const useCreateCharacterMutation = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createCharacter(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(
        ['character', data.character.id],
        data.character,
      );

      const prevUser: User | undefined = queryClient.getQueryData([
        'user',
        user.id,
      ]);

      if (prevUser) {
        queryClient.setQueryData(['user', user.id], {
          ...prevUser,
          characters: [...prevUser.characters, { id: data.character.id }],
        });
      }
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCharacterMutation;
