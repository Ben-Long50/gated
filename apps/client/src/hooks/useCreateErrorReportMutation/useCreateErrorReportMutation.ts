import { useMutation } from '@tanstack/react-query';
import createKeyword from './createErrorReport';
import { useNavigate } from 'react-router-dom';
import { ErrorReport } from '@gated/shared';

const useCreateErrorReportMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: ErrorReport) => {
      return createKeyword(formData);
    },
    onSettled: () => {
      navigate('/glam/codex');
    },
    throwOnError: false,
  });
};

export default useCreateErrorReportMutation;
