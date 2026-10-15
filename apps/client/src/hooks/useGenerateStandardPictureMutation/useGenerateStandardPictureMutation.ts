import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import generateStandardPicture from './generateStandardPicture';

const useGenerateStandardPictureMutation = (
  type: 'character' | 'item' | 'scene',
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: {
      setting: string;
      time: string;
      description: string;
      pictureCount: number;
    }) => {
      return generateStandardPicture(type, prompt);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['standardLibrary'] });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useGenerateStandardPictureMutation;
