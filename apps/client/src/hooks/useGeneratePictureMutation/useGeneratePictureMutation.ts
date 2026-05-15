import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import generatePicture from './generatePicture';

const useGeneratePictureMutation = () => {
  return useMutation({
    mutationFn: (prompt: string) => {
      return generatePicture(prompt);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useGeneratePictureMutation;
