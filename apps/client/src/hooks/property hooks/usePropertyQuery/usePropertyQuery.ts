import { useQuery } from '@tanstack/react-query';
import getProperty from './getProperty';
import { Property } from 'src/types/property';

const usePropertyQuery = (propertyId: number) => {
  return useQuery<Property>({
    queryKey: ['property', propertyId],
    queryFn: () => getProperty.fetch(propertyId),
    enabled: !!propertyId,
    throwOnError: false,
  });
};

export default usePropertyQuery;
