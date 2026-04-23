import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCampaign from './createCampaign';
import { toast } from 'react-toastify';

const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createCampaign(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['campaign', data.campaign.id], data.campaign);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCampaignMutation;
