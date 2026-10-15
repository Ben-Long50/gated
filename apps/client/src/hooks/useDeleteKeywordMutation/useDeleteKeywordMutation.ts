import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteKeyword from './deleteKeyword';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useDeleteKeywordMutation = (keywordId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteKeyword(keywordId);
    },
    onSuccess: () => {
      navigate('/glam/codex/keywords');

      return queryClient.invalidateQueries({
        queryKey: ['keywords'],
        exact: false,
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteKeywordMutation;
