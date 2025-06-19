import { useOutletContext, useParams } from 'react-router-dom';
import Modal from './Modal';
import BtnRect from '../buttons/BtnRect';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import Loading from '../Loading';
import { format } from 'date-fns';
import Divider from '../Divider';
import BtnIcon from '../buttons/BtnIcon';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import useSetCampaignTimeMutation from 'src/hooks/useSetCampaignTimeMutation/useSetCampaignTimeMutation';

const TimeModal = () => {
  const { apiUrl } = useContext(AuthContext);
  const { campaignId } = useParams();

  const currentTime = useOutletContext() || {};

  const [newTime, setNewTime] = useState<{
    hour: number;
    minute: number;
    second: number;
  }>(currentTime);

  const time = new Date();
  time.setHours(newTime.hour);
  time.setMinutes(newTime.minute);
  time.setSeconds(newTime.second);
  time.setMilliseconds(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleHourUp = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setNewTime((prev) => ({ ...prev, hour: prev.hour + 1 }));
    }, 100);
  };

  const handleHourDown = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setNewTime((prev) => ({ ...prev, hour: prev.hour - 1 }));
    }, 100);
  };

  const handleMinuteUp = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setNewTime((prev) => ({ ...prev, minute: prev.minute + 1 }));
    }, 100);
  };

  const handleMinuteDown = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setNewTime((prev) => ({ ...prev, minute: prev.minute - 1 }));
    }, 100);
  };

  const handleSecondUp = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setNewTime((prev) => ({ ...prev, second: prev.second + 1 }));
    }, 100);
  };

  const handleSecondDown = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setNewTime((prev) => ({ ...prev, second: prev.second - 1 }));
    }, 100);
  };

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const setCampaignTime = useSetCampaignTimeMutation(
    apiUrl,
    Number(campaignId),
  );

  return (
    <Modal>
      <h2>Set Campaign Time</h2>
      <Divider />
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="flex min-w-20 flex-col gap-4">
            <BtnIcon
              path={mdiChevronUp}
              active={true}
              onClick={() => {
                setNewTime((prev) => ({ ...prev, hour: prev.hour + 1 }));
              }}
              onMouseDown={handleHourUp}
              onMouseUp={clear}
            />
            <h1 className="text-center text-5xl">{format(time, 'HH')}</h1>
            <BtnIcon
              path={mdiChevronDown}
              active={true}
              onClick={() => {
                setNewTime((prev) => ({ ...prev, hour: prev.hour - 1 }));
              }}
              onMouseDown={handleHourDown}
              onMouseUp={clear}
            />
          </div>
          <h1 className="text-5xl">:</h1>
          <div className="flex min-w-20 flex-col gap-4">
            <BtnIcon
              path={mdiChevronUp}
              active={true}
              onClick={() => {
                setNewTime((prev) => ({ ...prev, minute: prev.minute + 1 }));
              }}
              onMouseDown={handleMinuteUp}
              onMouseUp={clear}
            />
            <h1 className="text-center text-5xl">{format(time, 'mm')}</h1>
            <BtnIcon
              path={mdiChevronDown}
              active={true}
              onClick={() => {
                setNewTime((prev) => ({ ...prev, minute: prev.minute - 1 }));
              }}
              onMouseDown={handleMinuteDown}
              onMouseUp={clear}
            />
          </div>
          <h1 className="text-5xl">:</h1>
          <div className="flex min-w-20 flex-col gap-4">
            <BtnIcon
              path={mdiChevronUp}
              active={true}
              onClick={() => {
                setNewTime((prev) => ({ ...prev, second: prev.second + 1 }));
              }}
              onMouseDown={handleSecondUp}
              onMouseUp={clear}
            />
            <h1 className="text-center text-5xl">{format(time, 'ss')}</h1>
            <BtnIcon
              path={mdiChevronDown}
              active={true}
              onClick={() => {
                setNewTime((prev) => ({ ...prev, second: prev.second - 1 }));
              }}
              onMouseDown={handleSecondDown}
              onMouseUp={clear}
            />
          </div>
        </div>
      </div>
      <Divider />
      <BtnRect
        className="group w-full"
        type="button"
        ariaLabel="Add event"
        onClick={() => setCampaignTime.mutate(newTime)}
      >
        {setCampaignTime.isPending ? (
          <Loading
            className="group-hover:text-accent dark:text-gray-900"
            size={1.15}
          />
        ) : (
          'Save Time'
        )}
      </BtnRect>
    </Modal>
  );
};

export default TimeModal;
