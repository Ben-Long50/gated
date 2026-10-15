import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import signup from './signup';

const useSignupMutation = (setErrors: (errors: string[]) => void) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (formData: object) => {
      return await signup(formData);
    },
    onSuccess: () => navigate('/signin'),
    onError: (error: string[]) => {
      setErrors(error);
    },
    throwOnError: false,
  });
};

export default useSignupMutation;
