import { useMutation } from '@tanstack/react-query';
import createAffiliation from './createAffiliation';
import { toast } from 'react-toastify';
import { Affiliation } from 'src/types/faction';

const useCreateAffiliationMutation = () => {
  return useMutation({
    mutationFn: (formData: Affiliation) => createAffiliation(formData),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateAffiliationMutation;
