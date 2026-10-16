import { useQuery } from '@tanstack/react-query';
import getCodexMaps from './getCodexMaps';
import { Map } from '@gated/shared';

const useCodexMapsQuery = () => {
  return useQuery<Map[]>({
    queryKey: ['codexMaps'],
    queryFn: () => getCodexMaps(),
  });
};

export default useCodexMapsQuery;
