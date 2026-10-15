import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteNotification from './deleteNotification';

const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => {
      return deleteNotification(notificationId);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['notifications'],
        exact: false,
      });
    },
    throwOnError: false,
  });
};

export default useDeleteNotificationMutation;
