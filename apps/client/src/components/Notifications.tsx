import { useEffect } from 'react';
import NotificationCard from './NotificationCard';
import useNotificationQuery from '../hooks/useNotificationQuery/useNotificationQuery';
import Loading from './Loading';
import { Notification } from 'src/types/notification';
import useMarkNotificationsReadMutation from 'src/hooks/useMarkNotificationsReadMutation/useMarkNotificationsReadMutation';
import Page from './Page';

const Notifications = () => {
  const { data: notifications, isLoading } = useNotificationQuery();

  const markNotificationsRead = useMarkNotificationsReadMutation();

  useEffect(() => {
    markNotificationsRead.mutate();
  }, []);

  if (isLoading) return <Loading />;

  return notifications.length === 0 ? (
    <>
      <p>You're all caught up</p>
    </>
  ) : (
    <Page title="Notifications">
      {notifications.map((notification: Notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </Page>
  );
};

export default Notifications;
