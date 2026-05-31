import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import generatePicture from './generatePicture';
import useModalStore from 'src/stores/modalStore';
import { useNavigate } from 'react-router-dom';

const useGeneratePictureMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return useMutation({
    mutationFn: (prompt: string) => {
      return generatePicture(prompt);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      if (backgroundPath) {
        navigate(backgroundPath, { replace: true });
      }
      queryClient.invalidateQueries({ queryKey: ['authenticatedUser'] });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useGeneratePictureMutation;
