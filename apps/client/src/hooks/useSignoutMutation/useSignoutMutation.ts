import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import signout from './signout';

const useSignoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await signout();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/signin');
    },
  });
};

export default useSignoutMutation;
