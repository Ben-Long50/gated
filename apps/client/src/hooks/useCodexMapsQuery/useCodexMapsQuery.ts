import { useQuery } from '@tanstack/react-query';
import getCodexMaps from './getCodexMaps';
import { Map } from 'src/types/map';

const useCodexMapsQuery = () => {
  return useQuery<Map[]>({
    queryKey: ['codexMaps'],
    queryFn: () => getCodexMaps(),
  });
};

export default useCodexMapsQuery;
