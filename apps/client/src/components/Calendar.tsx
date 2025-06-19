import { capitalCase } from 'change-case';
import ArrowHeader2 from './ArrowHeader2';
import ThemeContainer from './ThemeContainer';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight, mdiCircle } from '@mdi/js';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { useContext, useState } from 'react';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { AuthContext } from 'src/contexts/AuthContext';
import Loading from './Loading';
import useModalStore from 'src/stores/modalStore';
import BtnIcon from './buttons/BtnIcon';

const Calendar = () => {
  const { apiUrl } = useContext(AuthContext);
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

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    apiUrl,
    Number(campaignId),
  );

  const [month, setMonth] = useState(campaign.date.month);

  if (campaignLoading) return <Loading />;

  return (
    <ThemeContainer
      className="w-full"
      borderColor={accentPrimary}
      chamfer="medium"
    >
      <div className="flex w-full flex-col gap-4 p-4 sm:p-8">
        <div className="flex items-start justify-between">
          <ArrowHeader2
            className="whitespace-nowrap"
            title={capitalCase(month || '')}
          />
          <div className="flex w-full justify-end gap-4">
            {month !== 'arctus' && (
              <BtnIcon
                active={true}
                path={mdiChevronLeft}
                onClick={() =>
                  setMonth((prev: string) => {
                    const index = months.findIndex((month) => month === prev);
                    return months[index - 1];
                  })
                }
              />
            )}
            {month !== 'termina' && (
              <BtnIcon
                active={true}
                path={mdiChevronRight}
                onClick={() =>
                  setMonth((prev: string) => {
                    const index = months.findIndex((month) => month === prev);
                    return months[index + 1];
                  })
                }
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(36px,_1fr))] gap-1.5">
          {campaign?.calendar[month].schedule.map(
            (eventArray, index: number) => {
              return (
                <button
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
                        {eventArray.map(() => (
                          <Icon
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
