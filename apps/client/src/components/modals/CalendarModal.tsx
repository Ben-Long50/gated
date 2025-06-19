import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Modal from './Modal';
import { capitalCase } from 'change-case';
import Icon from '@mdi/react';
import { mdiCircle } from '@mdi/js';
import Divider from '../Divider';
import ArrowHeader3 from '../ArrowHeader3';
import BtnRect from '../buttons/BtnRect';
import ItemCardSmall from '../ItemCardSmall';

const CalendarModal = () => {
  const { month, day } = useParams();
  const navigate = useNavigate();

  const { eventArray } = useOutletContext() || {};

  return (
    <Modal>
      <div className="flex items-center gap-4">
        <h2>{capitalCase(month) || ''}</h2>
        <Icon path={mdiCircle} className="text-secondary" size={0.375} />
        <h2>{day}</h2>
      </div>
      <Divider className="-mt-0" />
      <div className="flex w-full flex-col items-start gap-4">
        <ArrowHeader3 title="Events" />
        {!eventArray ? (
          <p className="border-l-2 border-gray-400 border-opacity-50 pl-4">
            There are no events on this day
          </p>
        ) : (
          eventArray.map((event) => (
            <ItemCardSmall
              heading={
                <div className="mr-4 flex w-full items-center justify-between gap-4">
                  <h4>{event.name}</h4>
                  <p className="text-tertiary text-base">
                    ({event.character.firstName})
                  </p>
                </div>
              }
            >
              <p className="border-l-2 border-gray-400 border-opacity-50 pl-4">
                {event.description}
              </p>
            </ItemCardSmall>
          ))
        )}
      </div>
      <Divider className="-mb-0" />
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
