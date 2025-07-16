import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Modal from './Modal';
import { capitalCase } from 'change-case';
import Icon from '@mdi/react';
import { mdiCheckCircleOutline, mdiCircle, mdiCircleOutline } from '@mdi/js';
import Divider from '../Divider';
import ArrowHeader3 from '../ArrowHeader3';
import BtnRect from '../buttons/BtnRect';
import ItemCardSmall from '../ItemCardSmall';
import ExpandingList from '../ExpandingList';
import BtnIcon from '../buttons/BtnIcon';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import Loading from '../Loading';
import useSetCampaignDateMutation from 'src/hooks/useSetCampaignDateMutation/useSetCampaignDateMutation';
import { format } from 'date-fns';

const CalendarModal = () => {
  const { campaignId, month, day } = useParams();
  const navigate = useNavigate();

  const { eventArray } = useOutletContext() || {};

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const setCampaignDate = useSetCampaignDateMutation(Number(campaignId));

  if (campaignLoading) return <Loading />;

  return (
    <Modal>
      <div className="flex items-center gap-4">
        <h2>{capitalCase(month || '')}</h2>
        <Icon path={mdiCircle} className="text-secondary" size={0.375} />
        <h2>{day}</h2>
      </div>
      <Divider />
      <div className="flex w-full flex-col items-start gap-4">
        {
          <ExpandingList className="flex flex-col gap-4" title="Events">
            {!eventArray ? (
              <p className="border-l-2 border-gray-400 border-opacity-50 pl-4">
                There are no events on this day
              </p>
            ) : (
              eventArray.map((event) => {
                const time = new Date();
                if (event.time) {
                  time.setHours(event.time.hour);
                  time.setMinutes(event.time.minute);
                  time.setSeconds(event.time.second);
                  time.setMilliseconds(0);
                }

                return (
                  <ItemCardSmall
                    heading={
                      <div className="mr-4 flex w-full items-center justify-between gap-4">
                        <h4>{event.name}</h4>
                        {event.time &&
                        event.time.hour +
                          event.time.minute +
                          event.time.second >
                          0 ? (
                          <p>{format(time, 'HH : mm : ss')}</p>
                        ) : (
                          <p>All Day</p>
                        )}
                      </div>
                    }
                  >
                    <div className="flex flex-col gap-2 border-x-2 border-gray-400 border-opacity-50 px-4">
                      <div className="flex justify-between">
                        <p>Organizer</p>
                        <p>{event.character.firstName}</p>
                      </div>
                      <p>{event.description}</p>
                    </div>
                  </ItemCardSmall>
                );
              })
            )}
          </ExpandingList>
        }
      </div>
      <Divider />
      <div className="flex w-full flex-col items-start gap-4">
        <ArrowHeader3 title="GM Options" />
        <div className="w-full border-l-2 border-gray-400 border-opacity-50 pl-4">
          <div className="flex w-full items-center justify-between">
            <h4>Set Current Date</h4>
            {campaign?.date.month === month &&
            campaign?.date.day === Number(day) ? (
              <BtnIcon
                active={true}
                path={mdiCheckCircleOutline}
                onClick={() => {}}
              />
            ) : (
              <BtnIcon
                active={true}
                loading={setCampaignDate.isPending}
                path={mdiCircleOutline}
                onClick={() => {
                  if (month && day) {
                    setCampaignDate.mutate({ month, day: Number(day) });
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
      <BtnRect
        className="w-full"
        type="button"
        ariaLabel="Add event"
        onClick={() => navigate('newEvent')}
      >
        Add Event
      </BtnRect>
    </Modal>
  );
};

export default CalendarModal;
