import { useContext, useRef } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from '../../contexts/ThemeContext';
import WardIcon from '../icons/WardIcon';
import ArmorIcon from '../icons/ArmorIcon';
import EvasionIcon from '../icons/EvasionIcon';
import SpeedIcon from '../icons/SpeedIcon';
import CloudinaryPicture from '../CloudinaryPicture';
import ArrowHeader2 from '../ArrowHeader2';
import InjuryIcon from '../icons/InjuryIcon';
import InsanityIcon from '../icons/InsanityIcon';
import CharacterStatBars from './CharacterStatBars';
import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import ConditionTag from '../ConditionTag';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import CharacterRadialMenu from '../radialMenus/characterRadialMenu/CharacterRadialMenu';
import LocationIcon from '../icons/LocationIcon';
import constructName from 'src/utils/constructName';
import NpcTypeList from '../NpcTypeList';
import StatBarContainer from '../StatBarContainer';

const CharacterCard = ({
  characterId,
  menu = true,
  size = 'large',
}: {
  characterId: number;
  menu?: boolean;
  size?: 'small' | 'large';
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const menuOpen = useRadialMenuStore((state) => state.menuOpen);
  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);
  const setMenu = useRadialMenuStore((state) => state.setMenu);
  const setCoordinates = useRadialMenuStore((state) => state.setCoordinates);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerRef = useRef(null);

  const handleMenu = (e: MouseEvent) => {
    if (!containerRef.current) return;
    setMenu('character', 'large', characterId);

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!menuOpen) {
      setCoordinates(x, y);
    }
    setMenuOpen(!menuOpen);
  };

  const awol =
    (typeof character?.stats.injuries === 'number' &&
      character?.stats.injuries >= character?.stats.permanentInjuries) ||
    false;

  const insane =
    (typeof character?.stats?.insanities === 'number' &&
      character?.stats?.insanities >= character?.stats.permanentInsanities) ||
    false;

  if (isLoading) return <Loading />;

  if (!character) {
    return null;
  }

  return (
    <div className="w-full" ref={ref}>
      {inView && (
        <ThemeContainer
          className="group w-full"
          chamfer="medium"
          borderColor={accentPrimary}
        >
          <div
            ref={containerRef}
            className={`${size === 'small' ? 'grid grid-cols-1 grid-rows-[1fr_96px_auto]' : 'grid grid-cols-[1fr_96px_4fr] grid-rows-1'} relative w-full cursor-pointer select-none`}
            onClick={(e) => {
              e.stopPropagation();
              if (menu) {
                handleMenu(e);
              } else {
                navigate(`${character?.id}`);
              }
            }}
          >
            {menu && (
              <CharacterRadialMenu
                character={character}
                containerRef={containerRef}
              />
            )}
            <div
              className={`${size === 'small' ? 'row-span-2 aspect-square w-full' : 'col-span-2 aspect-[4/3] w-[425px]'} relative col-start-1 row-start-1 flex h-full items-center overflow-hidden rounded-bl clip-6`}
            >
              <CloudinaryPicture
                className={`${(awol || insane) && 'grayscale'} group-hover:bg-secondary`}
                publicId={character?.generatedPicture?.publicId}
                style={{
                  maskImage:
                    size === 'small'
                      ? 'linear-gradient(to bottom, black 0%, transparent 90%)'
                      : 'linear-gradient(to right, black 0%, transparent 90%)',
                }}
              />
              {(awol || insane) && (
                <div
                  className={`${awol && !insane && 'bg-red-600'} ${insane && !awol && 'bg-blue-600'} ${awol && insane && 'bg-purple-600'} absolute inset-0`}
                  style={{
                    maskImage:
                      size === 'small'
                        ? 'linear-gradient(to bottom, #00000080 0%, transparent 75%)'
                        : 'linear-gradient(to right, #00000080 0%, transparent 75%)',
                  }}
                />
              )}
              {
                <div
                  className={`${size === 'small' ? 'right-2 top-2' : 'bottom-2 left-2'} absolute flex grow flex-wrap items-center justify-start gap-1`}
                >
                  {character?.conditions?.map((condition) => (
                    <ConditionTag key={condition.id} condition={condition} />
                  ))}
                </div>
              }
            </div>
            <div
              className={`${size === 'small' ? 'col-start-1 row-span-2 row-start-2 gap-4 p-4' : 'col-span-2 col-start-2 row-start-1 gap-6 p-6'} relative flex h-full w-full flex-col justify-between`}
            >
              <div className="flex w-full items-center justify-start gap-4">
                <ArrowHeader2 title={constructName(character)} />
                <NpcTypeList npcTypes={character?.npcTypes} />
                <p className="!text-accent ml-auto flex size-8 shrink-0 items-center justify-center text-3xl font-semibold sm:pt-1">
                  {character?.level}
                </p>
              </div>
              {character?.location && (
                <div className="flex gap-4">
                  <LocationIcon className="text-accent size-6" />
                  <h4 className="!text-accent">
                    {character.location.map.name}
                  </h4>
                </div>
              )}
              <StatBarContainer size={size}>
                <CharacterStatBars
                  stats={{
                    maxHealth: character?.stats.maxHealth,
                    maxSanity: character?.stats.maxSanity,
                    currentHealth: character?.stats.currentHealth,
                    currentSanity: character?.stats.currentSanity,
                  }}
                  cardWidth={containerRef.current?.offsetWidth}
                  characterId={character?.id}
                  size={size}
                />
              </StatBarContainer>
              <div
                className={`${size === 'small' ? 'flex-col gap-4' : 'flex-row gap-8'} flex w-full items-center justify-between`}
              >
                <div
                  className={`${size === 'small' ? 'justify-around gap-4' : 'justify-start gap-8'} flex w-full items-center justify-start`}
                >
                  <div className="flex flex-col items-center justify-between gap-2">
                    {size === 'large' && (
                      <h3 className="text-primary text-xl font-semibold tracking-widest">
                        Speed
                      </h3>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <SpeedIcon className="text-secondary size-8" />
                      <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                        {character?.stats.speed}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-between gap-2">
                    {size === 'large' && (
                      <h3 className="text-primary text-xl font-semibold tracking-widest">
                        Evasion
                      </h3>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <EvasionIcon className="text-secondary size-8" />
                      <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                        {character?.stats.evasion}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-between gap-2">
                    {size === 'large' && (
                      <h3 className="text-primary text-xl font-semibold tracking-widest">
                        Armor
                      </h3>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <ArmorIcon className="text-secondary size-8" />
                      <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                        {character?.stats.armor}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-between gap-2">
                    {size === 'large' && (
                      <h3 className="text-primary text-xl font-semibold tracking-widest">
                        Ward
                      </h3>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <WardIcon className="text-secondary size-8" />
                      <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                        {character?.stats.ward}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`${size === 'small' ? 'gap-4' : 'gap-8'} flex w-full items-end justify-end`}
                >
                  <div className="flex flex-col items-center justify-between gap-2">
                    {size === 'large' && (
                      <h3 className="text-primary text-xl font-semibold tracking-widest">
                        Injuries
                      </h3>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <InjuryIcon className="text-secondary size-8" />
                      <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                        {character?.stats.injuries || 0} /{' '}
                        {character?.stats.permanentInjuries}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-between gap-2">
                    {size === 'large' && (
                      <h3 className="text-primary text-xl font-semibold tracking-widest">
                        Insanities
                      </h3>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <InsanityIcon className="text-secondary size-8" />
                      <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                        {character?.stats.insanities || 0} /{' '}
                        {character?.stats.permanentInsanities}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ThemeContainer>
      )}
    </div>
  );
};

export default CharacterCard;
