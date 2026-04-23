import { useMutation } from '@tanstack/react-query';
import deleteAction from './deleteAffiliation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useDeleteAffiliationMutation = (affiliationId: number) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteAction(affiliationId);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(-1);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteAffiliationMutation;
