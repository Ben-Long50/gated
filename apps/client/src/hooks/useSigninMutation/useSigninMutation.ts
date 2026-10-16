import { useMutation, useQueryClient } from '@tanstack/react-query';
import signin from './signin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useSigninMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: object) => signin(formData),
    onSuccess: () => {
      queryClient.clear();
      navigate('/glam/codex/dashboard?tab=equipment');
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useSigninMutation;
