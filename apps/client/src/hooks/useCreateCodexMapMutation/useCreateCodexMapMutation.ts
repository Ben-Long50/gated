import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import createCodexMap from './createCodexMap';
import { useNavigate } from 'react-router-dom';
import { Map, MapInput } from 'src/types/map';

const useCreateCodexMapMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: MapInput) => {
      return createCodexMap(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      const prevMaps: Map[] | undefined = queryClient.getQueryData([
        'codexMaps',
      ]);

      if (prevMaps) {
        queryClient.setQueryData(
          ['codexMaps'],
          [...prevMaps, data.map].sort((a, b) => a.name.localCompare(b.name)),
        );
      }

      navigate(`/glam/codex/maps/${data.map.id}`);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCodexMapMutation;
