import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import generatePicture from './generatePicture';
import useModalStore from 'src/stores/modalStore';
import { useNavigate } from 'react-router-dom';

const useGeneratePictureMutation = (type: 'character' | 'item' | 'scene') => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return useMutation({
    mutationFn: (prompt: {
      setting: string;
      time: string;
      description: string;
      pictureCount: number;
    }) => {
      return generatePicture(type, prompt);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      if (backgroundPath) {
        navigate(backgroundPath, { replace: true });
      }
      queryClient.setQueryData(['authenticatedUser'], data.user);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useGeneratePictureMutation;
