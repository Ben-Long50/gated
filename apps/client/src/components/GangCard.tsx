import { useContext } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import BtnRect from './buttons/BtnRect';
import { useNavigate } from 'react-router-dom';
import { Character } from 'src/types/character';
import ArrowHeader2 from './ArrowHeader2';
import Divider from './Divider';
import ArrowHeader3 from './ArrowHeader3';
import CloudinaryPicture from './CloudinaryPicture';
import useGang from 'src/hooks/useGang';
import CharacterCardXSmall from './characterComponents/CharacterCardXSmall';
import Loading from './Loading';

const GangCard = ({ gangId }: { gangId: number }) => {
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();

  const {
    gang,
    gangPoints,
    reputationData,
    memberCount,
    goonCount,
    gangLoading,
  } = useGang(gangId);

  if (gangLoading) {
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
            publicId={gang?.picture?.publicId}
            style={{
              maskImage: 'linear-gradient(to right, black 0%, transparent 90%',
            }}
          />
        </div>
        <div className="col-span-2 col-start-2 row-start-1 flex h-full w-full flex-col justify-between gap-4 p-8 md:gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <ArrowHeader2 title={gang?.name} />
              <p className="!text-accent font-zen text-2xl">
                Level {gang?.level}
              </p>
            </div>
            <div className="flex w-full items-start justify-between gap-8">
              <div className="flex w-full flex-col items-start gap-2">
                <p>{`Reputation ${reputationData.reputationPoints}`}</p>
                <p>{`Members ${memberCount}`}</p>
                <p>{`Goons ${goonCount}`}</p>
              </div>
              <div className="flex w-full flex-col items-end gap-2">
                <p>{`Gang Points ${gangPoints}`}</p>
                <p>{`Profits ${gang?.profits}`}</p>
              </div>
            </div>
            <Divider />
            <ArrowHeader3 title="Leaders" />
            <div className="flex flex-col gap-4">
              {gang?.leaders.map((character: Character) => (
                <CharacterCardXSmall
                  key={character.id}
                  character={character}
                  characterList={true}
                  active={false}
                />
              ))}
            </div>
          </div>
          <BtnRect
            ariaLabel="navigate to gang information w-full"
            onClick={() =>
              navigate(`/glam/campaigns/${gang?.campaignId}/gangs/${gang?.id}`)
            }
          >
            Gang Info
          </BtnRect>
        </div>
      </div>
    </ThemeContainer>
  );
};

export default GangCard;
