import { useMutation } from '@tanstack/react-query';
import createKeyword from './createErrorReport';
import { useNavigate } from 'react-router-dom';

const useCreateErrorReportMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: object) => {
      return createKeyword(formData);
    },
    onSettled: () => {
      navigate('/glam/codex');
    },
    throwOnError: false,
  });
};

export default useCreateErrorReportMutation;
