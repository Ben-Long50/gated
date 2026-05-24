import { useQuery } from '@tanstack/react-query';
import getAuthPicture from './getAuthPicture';

const useAuthPictureQuery = () => {
  return useQuery<{ url: string }>({
    queryKey: ['authPicture'],
    queryFn: () => getAuthPicture(),
  });
};

export default useAuthPictureQuery;
