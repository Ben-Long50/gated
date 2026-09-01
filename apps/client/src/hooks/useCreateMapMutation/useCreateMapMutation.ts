import { useMutation, useQueryClient } from '@tanstack/react-query';
import createMap from './createMap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useCreateMapMutation = (mapId?: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createMap(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['map', mapId], data.map);

      navigate(-1);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateMapMutation;
