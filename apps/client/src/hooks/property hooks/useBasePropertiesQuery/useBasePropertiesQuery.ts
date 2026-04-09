import { useQuery } from '@tanstack/react-query';
import { Property } from 'src/types/property';
import getBaseProperties from './getBaseProperties';

const useBasePropertiesQuery = () => {
  return useQuery<Property[]>({
    queryKey: ['baseProperties'],
    queryFn: () => getBaseProperties(),
    throwOnError: false,
  });
};

export default useBasePropertiesQuery;
