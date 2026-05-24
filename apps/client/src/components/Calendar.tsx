import { capitalCase } from 'change-case';
import Icon from '@mdi/react';
import {
  mdiCalendarOutline,
  mdiCircle,
  mdiClockOutline,
  mdiPlay,
} from '@mdi/js';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import Loading from './Loading';
import ArrowHeader3 from './ArrowHeader3';
import IconBtnSmall from './buttons/IconBtnSmall';

const Calendar = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const { data: campaign, isLoading } = useCampaignQuery(Number(campaignId));

  if (isLoading) return <Loading />;

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center justify-between gap-4">
        <ArrowHeader3 title="Calendar" />
        <div className="flex items-center justify-end gap-4">
          <IconBtnSmall onClick={() => navigate('date')}>
            <Icon
              className="timing text-tertiary group-hover:text-accent"
              path={mdiCalendarOutline}
            />
          </IconBtnSmall>
          <IconBtnSmall onClick={() => navigate('time')}>
            <Icon
              className="timing text-tertiary group-hover:text-accent"
              path={mdiClockOutline}
            />
          </IconBtnSmall>
          <IconBtnSmall onClick={() => navigate('time')}>
            <Icon
              className="timing text-tertiary group-hover:text-accent"
              path={mdiPlay}
            />
          </IconBtnSmall>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <p className="text-2xl font-semibold">
            {capitalCase(campaign?.date.month)}
          </p>
          <Icon className="text-primary" path={mdiCircle} size={0.3} />
          <p className="text-2xl font-semibold">{campaign?.date.day}</p>
        </div>
        <p className="text-2xl font-semibold">
          {campaign?.time.hour} : {campaign?.time.minute} :{' '}
          {campaign?.time.second}
        </p>
      </div>
      {campaign?.events.length > 0 ? <p>Events</p> : <p>No upcoming events</p>}
      {(parts.includes('date') || parts.includes('time')) && (
        <Outlet context={{ date: campaign?.date, time: campaign?.time }} />
      )}
    </div>
  );
};

export default Calendar;
