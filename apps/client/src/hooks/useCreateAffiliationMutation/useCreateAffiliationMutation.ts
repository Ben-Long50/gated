import { useMutation, useQueryClient } from '@tanstack/react-query';
import createAffiliation from './createAffiliation';
import { toast } from 'react-toastify';
import { Affiliation } from 'src/types/faction';

const useCreateAffiliationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: Affiliation) => createAffiliation(formData),
    onSuccess: (data) => {
      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['campaign', data.affiliation.campaignId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateAffiliationMutation;
