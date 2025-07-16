import { useMutation, useQueryClient } from '@tanstack/react-query';
import signin from './signin';
import { useNavigate } from 'react-router-dom';

const useSigninMutation = (setErrors: (errors: string[]) => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (formData: object) => {
      return await signin(formData);
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/glam/codex');
    },
    onError: (error: string[]) => {
      setErrors(error);
    },
    throwOnError: false,
  });
};

export default useSigninMutation;
