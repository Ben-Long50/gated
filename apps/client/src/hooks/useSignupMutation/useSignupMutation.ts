import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import signup from './signup';
import { toast } from 'react-toastify';

const useSignupMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (formData: object) => {
      return await signup(formData);
    },
    onSuccess: () => navigate('/signin'),
    onError: (error: string[]) => {
      const errors = error.join(', ');
      toast.error(errors);
    },
    throwOnError: false,
  });
};

export default useSignupMutation;
