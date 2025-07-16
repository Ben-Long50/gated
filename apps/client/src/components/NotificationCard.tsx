import { useContext } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { Notification } from 'src/types/notification';
import BtnRect from './buttons/BtnRect';
import { Link } from 'react-router-dom';
import AccountPicture from './AccountPicture';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';
import useDeleteNotificationMutation from '../hooks/useDeleteNotificationMutation/useDeleteNotificationMutation';
import { AuthContext } from '../contexts/AuthContext';
import useUpdateLiveCampaignMutation from 'src/hooks/campaign hooks/useUpdateLiveCampaignMutation/useUpdateLiveCampaignMutation';

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);

  const deleteNotification = useDeleteNotificationMutation();

  const updateLiveCampaign = useUpdateLiveCampaignMutation(
    user?.id,
    notification.campaign?.id,
  );

  let notificationInfo = {} as {
    message: string;
    buttonText?: string;
    path?: string;
    name?: string;
    function?: Function;
  };

  switch (notification.type) {
    case 'campaignInvite':
      notificationInfo = {
        message:
          'has invited you to join a new campaign. Head to the pending campaigns page by clicking the button to view the details of the new campaign.',
        buttonText: 'Pending Campaigns',
        path: '/glam/campaigns?campaignType=pending',
        name: notification.campaign?.name,
      };
      break;
    case 'liveCampaignInvite':
      notificationInfo = {
        message: 'has activated your campaign. Click the button below to join.',
        buttonText: 'Join Campaign',
        path: `/glam/campaigns/${notification.campaign?.id}`,
        name: notification.campaign?.name,
        function: () => updateLiveCampaign.mutate(),
      };
      break;
    case 'sessionInvite':
      notificationInfo = {
        message:
          'has invited you to join a new session. Head to the pending sessions page by clicking the button to view the details of the new session.',
      };
      break;
    default:
      break;
  }

  return (
    <ThemeContainer
      className="w-full"
      chamfer="medium"
      borderColor={accentPrimary}
    >
      <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div className="flex items-center">
              <AccountPicture user={notification.sender} />
              <h2 className="ml-4">{notification.sender.username}</h2>
            </div>
            {notificationInfo.name && (
              <p className="!text-tertiary">({notificationInfo.name})</p>
            )}
          </div>
          <div className="flex items-start gap-4 justify-self-end">
            <p className="whitespace-nowrap">
              {format(notification.createdAt, 'PP')}
            </p>
          </div>
        </div>
        <p>
          <span>{notification.sender.username} </span>
          {notificationInfo.message}
        </p>
        <Link className="self-end" to={notificationInfo.path}>
          <BtnRect
            type="button"
            ariaLabel="Navigate to pending campaigns"
            onClick={() => {
              if (notificationInfo.function) {
                notificationInfo.function();
              }
            }}
          >
            {notificationInfo.buttonText}
          </BtnRect>
        </Link>
      </div>
      <button
        aria-label="Delete notification"
        className="absolute bottom-4 left-4"
        onClick={() => deleteNotification.mutate(notification.id)}
      >
        <Icon
          className="text-tertiary hover:text-accent timing size-8"
          path={mdiTrashCanOutline}
        />
      </button>
    </ThemeContainer>
  );
};

export default NotificationCard;
