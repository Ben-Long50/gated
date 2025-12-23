import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import { LayoutContext } from '../contexts/LayoutContext';
import WardIcon from './icons/WardIcon';
import ArmorIcon from './icons/ArmorIcon';
import EvasionIcon from './icons/EvasionIcon';
import SpeedIcon from './icons/SpeedIcon';
import CloudinaryImage from './CloudinaryImage';
import ArrowHeader2 from './ArrowHeader2';
import InjuryIcon from './icons/InjuryIcon';
import InsanityIcon from './icons/InsanityIcon';
import CharacterStatBars from './CharacterStatBars';
import useCharacter from 'src/hooks/useCharacter';
import Loading from './Loading';
import { capitalCase } from 'change-case';
import ConditionTag from './ConditionTag';
import { Outlet, useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import CharacterRadialMenu from './radialMenus/characterRadialMenu/CharacterRadialMenu';
import LocationIcon from './icons/LocationIcon';
import BtnRect from './buttons/BtnRect';
import useCreateTemplateCharacterMutation from 'src/hooks/useCreateTemplateCharacterMutation/useCreateTemplateCharacterMutation';
import useDeleteCharacterMutation from 'src/hooks/useDeleteCharacterMutation/useDeleteCharacterMutation';

const CharacterCard = ({ characterId }: { characterId: number }) => {
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);
  const { conditionId } = useParams();
  const [cardWidth, setCardWidth] = useState(0);

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const createTemplateCharacter =
    useCreateTemplateCharacterMutation(characterId);

  const deleteCharacter = useDeleteCharacterMutation(characterId);

  const menuOpen = useRadialMenuStore((state) => state.menuOpen);
  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);
  const setMenu = useRadialMenuStore((state) => state.setMenu);
  const setCoordinates = useRadialMenuStore((state) => state.setCoordinates);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const characterName = character?.lastName
    ? character?.firstName + ' ' + character?.lastName
    : character?.firstName;

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

  useEffect(() => {
    if (containerRef.current) {
      setCardWidth(containerRef.current.offsetWidth);
    }
  }, [inView]);

  const awol =
    (typeof character?.stats.injuries === 'number' &&
      character?.stats.injuries >= character?.stats.permanentInjuries) ||
    false;

  const insane =
    (typeof character?.stats?.insanities === 'number' &&
      character?.stats?.insanities >= character.stats?.permanentInsanities) ||
    false;

  if (isLoading) return <Loading />;

  return (
    <div className="w-full" ref={ref}>
      {inView && (
        <ThemeContainer
          className="w-full"
          chamfer="medium"
          borderColor={accentPrimary}
        >
          <div
            ref={containerRef}
            className="relative grid w-full cursor-pointer select-none sm:grid-cols-[1fr_1fr_4fr]"
            onClick={(e) => {
              e.stopPropagation();
              handleMenu(e);
            }}
          >
            <CharacterRadialMenu
              character={character}
              containerRef={containerRef}
            />
            <div className="col-span-2 col-start-1 row-start-1 flex aspect-square h-full w-[300px] items-center overflow-hidden rounded-bl clip-6">
              <CloudinaryImage
                className={`${awol && 'grayscale'}`}
                publicId={character?.picture?.publicId}
                position={character?.picture?.position}
                style={{
                  maskImage:
                    'linear-gradient(to right, black 0%, transparent 90%',
                }}
              />
              {mobile && (
                <div className="absolute inset-0 bg-zinc-900 bg-opacity-60" />
              )}
              {(awol || insane) && (
                <div className="absolute left-2 top-4 flex items-center justify-start gap-4">
                  {awol && (
                    <div className="bg-primary rounded-full border-2 border-white p-1.5 shadow-md shadow-black">
                      <InjuryIcon className="size-12 fill-white stroke-red-700 stroke-2 p-0.5" />
                    </div>
                  )}
                  {insane && (
                    <div className="bg-primary rounded-full border-2 border-white p-1.5 shadow-md shadow-black">
                      <InsanityIcon className="size-12 fill-white stroke-blue-600 stroke-[2.25] p-0.5" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative col-span-2 col-start-2 row-start-1 flex h-full w-full flex-col justify-between gap-4 p-4 md:gap-6 md:p-6">
              <div className="flex w-full items-center justify-between gap-4">
                <ArrowHeader2 title={characterName} />
                {character?.npcTypes && character?.npcTypes?.length > 0 && (
                  <h4 className="text-tertiary">
                    (
                    {character.npcTypes
                      .map((type) => capitalCase(type))
                      .join(', ')}
                    )
                  </h4>
                )}
                {!mobile && (
                  <div className="flex grow flex-wrap items-center justify-start gap-1">
                    {character?.conditions?.map((condition) => (
                      <Fragment key={condition.id}>
                        <ConditionTag
                          key={condition.id}
                          condition={condition}
                        />
                        {Number(conditionId) === condition.id && (
                          <Outlet context={{ condition }} />
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}
                <p className="!text-accent flex size-8 shrink-0 items-center justify-center text-3xl font-semibold sm:pt-1">
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
              {mobile && (
                <div className="flex grow flex-wrap items-center justify-start gap-1">
                  {character?.conditions?.map((condition) => (
                    <ConditionTag key={condition.id} condition={condition} />
                  ))}
                </div>
              )}
              <div
                className={`${cardWidth < 500 ? 'gap-2' : 'gap-4'} grid h-full w-full grow grid-cols-[auto_auto_1fr_auto] place-items-center gap-y-2`}
              >
                <CharacterStatBars
                  stats={{
                    maxHealth: character?.stats.maxHealth,
                    maxSanity: character?.stats.maxSanity,
                    currentHealth: character?.stats.currentHealth,
                    currentSanity: character?.stats.currentSanity,
                  }}
                  cardWidth={containerRef.current?.offsetWidth}
                  characterId={character?.id}
                />
              </div>
              <div
                className={`${mobile ? 'flex-col' : 'flex-row'} flex w-full flex-wrap items-center justify-between gap-6`}
              >
                <div
                  className={`${mobile ? 'justify-center' : 'justify-start'} flex items-center justify-start gap-6`}
                >
                  <div className="flex flex-col items-center justify-between gap-2">
                    {!mobile && (
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
                    {!mobile && (
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
                    {!mobile && (
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
                    {!mobile && (
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
                <div className="ml-auto flex items-end justify-end gap-6">
                  <div className="flex flex-col items-center justify-between gap-2">
                    {!mobile && (
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
                    {!mobile && (
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
              {
                <BtnRect
                  className="group"
                  ariaLabel="Create template character"
                  type="button"
                  onClick={() => deleteCharacter.mutate()}
                >
                  {deleteCharacter.isPending ? (
                    <Loading
                      className="group-hover:text-accent dark:text-gray-900"
                      size={1.15}
                    />
                  ) : (
                    'Delete Character'
                  )}
                </BtnRect>
              }
              {character?.npcTypes.includes('template') && (
                <BtnRect
                  className="group"
                  ariaLabel="Create template character"
                  type="button"
                  onClick={() => createTemplateCharacter.mutate()}
                >
                  {createTemplateCharacter.isPending ? (
                    <Loading
                      className="group-hover:text-accent dark:text-gray-900"
                      size={1.15}
                    />
                  ) : (
                    'Create Copy'
                  )}
                </BtnRect>
              )}
            </div>
          </div>
        </ThemeContainer>
      )}
    </div>
  );
};

export default CharacterCard;
