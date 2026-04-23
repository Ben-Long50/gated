import { useMutation, useQueryClient } from '@tanstack/react-query';
import createGang from './createGang';
import { toast } from 'react-toastify';

const useCreateGangMutation = (campaignId: number, gangId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createGang(campaignId, formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['gang', gangId], data.gang);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateGangMutation;
