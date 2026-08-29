import { useContext } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import BtnRect from './buttons/BtnRect';
import { useNavigate } from 'react-router-dom';
import CloudinaryPicture from './CloudinaryPicture';
import useFactionQuery from 'src/hooks/faction hooks/useFactionQuery';
import Loading from './Loading';
import ArrowHeader3 from './ArrowHeader3';

const FactionCard = ({ factionId }: { factionId: number }) => {
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();

  const { data: faction, isLoading } = useFactionQuery(factionId);

  const gangCount = faction?.gangs.length;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ThemeContainer
      className="w-full"
      chamfer="large"
      borderColor={accentPrimary}
      overflowHidden={true}
    >
      <div className="relative grid w-full cursor-pointer select-none grid-cols-[1fr_1fr_4fr]">
        <div className="-z-10 col-span-2 col-start-1 row-start-1">
          <CloudinaryPicture
            publicId={faction?.picture?.publicId}
            style={{
              maskImage: 'linear-gradient(to right, black 0%, transparent 90%',
            }}
          />
        </div>
        <div className="col-span-2 col-start-2 row-start-1 flex h-full w-full flex-col justify-between gap-4 p-8 md:gap-6">
          <ArrowHeader3 title={faction?.name} />
          <p>Affiliated Gangs {gangCount}</p>
          <BtnRect
            ariaLabel="navigate to faction information w-full"
            onClick={() =>
              navigate(
                `/glam/campaigns/${faction?.campaignId}/factions/${faction?.id}`,
              )
            }
          >
            Faction Info
          </BtnRect>
        </div>
      </div>
    </ThemeContainer>
  );
};

export default FactionCard;
