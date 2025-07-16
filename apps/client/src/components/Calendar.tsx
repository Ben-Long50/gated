import { capitalCase } from 'change-case';
import ArrowHeader2 from './ArrowHeader2';
import ThemeContainer from './ThemeContainer';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight, mdiCircle, mdiPlay } from '@mdi/js';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { useContext, useState } from 'react';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { AuthContext } from 'src/contexts/AuthContext';
import Loading from './Loading';
import useModalStore from 'src/stores/modalStore';
import BtnIcon from './buttons/BtnIcon';
import { Month } from 'src/types/campaign';
import Divider from './Divider';
import { format } from 'date-fns';

const Calendar = () => {
  const { campaignId, day } = useParams();
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const months = [
    'arctus',
    'pluvia',
    'kavir',
    'husk',
    'nagai',
    'zenzi',
    'haqMilah',
    'termina',
  ];

  const colorValue = accentPrimary.concat('80');

  const setBackgroundPath = useModalStore((state) => state.setBackgroundPath);

  const openCalendarModal = (month: string, day: number) => {
    setBackgroundPath(location.pathname);
    navigate(`calendar/${month}/${day}`);
  };

  const openTimeModal = () => {
    setBackgroundPath(location.pathname);
    navigate(`calendar/time`);
  };

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const [month, setMonth] = useState<Month | undefined>(campaign?.date.month);

  const time = new Date();
  time.setHours(campaign?.time.hour);
  time.setMinutes(campaign?.time.minute);
  time.setSeconds(campaign?.time.second);
  time.setMilliseconds(0);

  if (campaignLoading) return <Loading />;

  return (
    <ThemeContainer
      className="w-full"
      borderColor={accentPrimary}
      chamfer="medium"
    >
      <div className="flex w-full flex-col gap-4 p-4 sm:p-8">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <ArrowHeader2 title={capitalCase(campaign?.date.month)} />
            <Icon className="text-primary" path={mdiCircle} size={0.3} />
            <h2>{campaign?.date.day}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => openTimeModal()}>
              <h2>{format(time, 'HH:mm:ss')}</h2>
            </button>
            {parts.includes('time') && <Outlet context={campaign?.time} />}
            <BtnIcon path={mdiPlay} active={true} onClick={() => {}} />
          </div>
        </div>
        <Divider />
        <div className="flex w-full justify-between gap-4">
          <BtnIcon
            active={month !== 'arctus'}
            path={mdiChevronLeft}
            onClick={() =>
              setMonth((prev) => {
                const index = months.findIndex((month) => month === prev);
                return months[index - 1] as Month;
              })
            }
          />
          <h2>{capitalCase(month || '')}</h2>
          <BtnIcon
            active={month !== 'termina'}
            path={mdiChevronRight}
            onClick={() =>
              setMonth((prev) => {
                const index = months.findIndex((month) => month === prev);
                return months[index + 1] as Month;
              })
            }
          />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(36px,_1fr))] gap-1.5">
          {campaign?.calendar[month as Month].schedule.map(
            (eventArray, index: number) => {
              return (
                <button
                  key={index}
                  className="hover:bg-tertiary relative grid aspect-square grid-rows-2 rounded border-2 border-gray-400 border-opacity-50"
                  style={{
                    borderColor:
                      index + 1 === campaign.date.day &&
                      month === campaign.date.month
                        ? accentPrimary
                        : hoveredIndex === index
                          ? colorValue
                          : null,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => openCalendarModal(month, index + 1)}
                >
                  <p className="absolute right-0.5 top-0.5 text-right text-xs">
                    {index + 1}
                  </p>
                  {eventArray &&
                    (eventArray.length > 3 ? (
                      <div className="row-start-2 flex items-center justify-center gap-0.5">
                        <p className="!text-accent text-xs font-semibold">
                          {eventArray.length}
                        </p>
                        <Icon
                          path={mdiCircle}
                          size={0.3}
                          className="text-accent"
                        />
                      </div>
                    ) : (
                      <div className="row-start-2 flex items-center justify-center gap-0.5">
                        {eventArray.map((_, index) => (
                          <Icon
                            key={index}
                            path={mdiCircle}
                            size={0.3}
                            className="text-accent"
                          />
                        ))}
                      </div>
                    ))}
                  {parts.includes('calendar') && Number(day) === index + 1 && (
                    <Outlet context={{ eventArray }} />
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>
    </ThemeContainer>
  );
};

export default Calendar;
