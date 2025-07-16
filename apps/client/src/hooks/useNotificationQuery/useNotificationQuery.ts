import { useQuery } from '@tanstack/react-query';
import getNotifications from './getNotifications';

const useNotificationQuery = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => await getNotifications(),
    throwOnError: false,
  });
};

export default useNotificationQuery;
