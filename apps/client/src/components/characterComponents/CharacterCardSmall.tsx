import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from './CharacterPictureRound';
import CharacterStatBars from './CharacterStatBars';
import Loading from '../Loading';
import ArrowHeader4 from '../ArrowHeader4';
import WardIcon from '../icons/WardIcon';
import SpeedIcon from '../icons/SpeedIcon';
import EvasionIcon from '../icons/EvasionIcon';
import ArmorIcon from '../icons/ArmorIcon';
import useMapStore from 'src/stores/mapStore';
import { motion } from 'motion/react';
import ConditionTag from '../ConditionTag';
import { useLayoutEffect, useRef, useState } from 'react';
import CharacterRadialMenu from '../radialMenus/characterRadialMenu/CharacterRadialMenu';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import Icon from '@mdi/react';
import { mdiCrown } from '@mdi/js';
import StatBarContainer from '../StatBarContainer';

const CharacterCardSmall = ({
  characterList,
  characterId,
  className,
  expanding,
  active,
}: {
  characterList: boolean;
  characterId: number;
  className?: string;
  expanding: boolean;
  active: boolean;
}) => {
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);
  const [detailHeight, setDetailHeight] = useState(1000);

  const detailRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef(null);

  const menuOpen = useRadialMenuStore((state) => state.menuOpen);
  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);
  const setMenu = useRadialMenuStore((state) => state.setMenu);
  const setCoordinates = useRadialMenuStore((state) => state.setCoordinates);

  const setCharacterId = useMapStore((state) => state.setCharacterId);

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

  useLayoutEffect(() => {
    if (detailRef.current) {
      setDetailHeight(detailRef.current.offsetHeight);
    }
  }, [detailRef.current]);

  const id = useMapStore((state) => state.characterId);

  if (isLoading) return <Loading size={1.25} />;

  return (
    <div
      ref={containerRef}
      className={`${className} timing relative flex cursor-pointer flex-col`}
      onClick={(e) => {
        e.stopPropagation();
        handleMenu(e);
      }}
      onMouseEnter={() => {
        if (expanding) {
          setCharacterId(characterId);
        }
      }}
      onMouseLeave={() => {
        if (expanding) {
          setCharacterId(null);
        }
      }}
    >
      <CharacterRadialMenu character={character} containerRef={containerRef} />
      <div className="mb-2 flex items-center justify-between gap-8">
        <ArrowHeader4
          className={`${characterList ? 'visible h-8 translate-x-0 opacity-100' : 'invisible h-0 -translate-x-full opacity-0'} ${active ? 'text-accent' : 'text-primary'} timing w-full`}
          title={character?.name}
        />
        {character?.gang && (
          <div className="flex items-center gap-2">
            <p className="!text-accent whitespace-nowrap text-base">
              {character?.gang.name}
            </p>
          </div>
        )}
        {character?.controlledGang && (
          <div className="flex items-center gap-2">
            <Icon path={mdiCrown} className="text-accent size-6" />
            <p className="!text-accent whitespace-nowrap text-base">
              {character?.controlledGang.name}
            </p>
          </div>
        )}
      </div>

      <div className={`relative flex items-center gap-2`}>
        <CharacterPictureRound
          className={`${active && 'liveToken'}`}
          character={character}
        />
        {character?.conditions && character?.conditions.length > 0 && (
          <div className="absolute left-0 top-0 z-10 size-3 rounded-full bg-red-600 shadow-md shadow-black"></div>
        )}
        <StatBarContainer>
          <CharacterStatBars
            characterId={character?.id}
            size="small"
            stats={{
              currentHealth: character?.stats.currentHealth,
              maxHealth: character?.stats.maxHealth,
              currentSanity: character?.stats.currentSanity,
              maxSanity: character?.stats.maxSanity,
            }}
            cardWidth={300}
          />
        </StatBarContainer>
      </div>
      {expanding && (
        <div
          className={`${characterList ? 'visible translate-x-0 opacity-100' : 'invisible -translate-x-full opacity-0'} timing w-full overflow-hidden`}
        >
          <motion.div
            ref={detailRef}
            className="flex w-full flex-col items-center justify-around gap-2 pt-2"
            initial={{ marginTop: -detailHeight - 8 }}
            animate={{
              marginTop: id === characterId ? 0 : -detailHeight - 8,
            }}
            transition={{ duration: 0.2 }}
          >
            {character?.conditions && character.conditions.length > 0 && (
              <div className="flex w-full justify-start gap-1">
                {character?.conditions.map((condition) => (
                  <ConditionTag key={condition.id} condition={condition} />
                ))}
              </div>
            )}
            <div className="flex w-full items-center justify-around gap-2">
              <div className="flex flex-col items-center justify-between gap-2">
                <div className="flex items-center justify-center gap-2">
                  <SpeedIcon className="text-secondary size-7" />
                  <p className="text-secondary text-xl sm:pt-1">
                    {character?.stats.speed}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between gap-2">
                <div className="flex items-center justify-center gap-2">
                  <EvasionIcon className="text-secondary size-7" />
                  <p className="text-secondary text-xl sm:pt-1">
                    {character?.stats.evasion}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between gap-2">
                <div className="flex items-center justify-center gap-2">
                  <ArmorIcon className="text-secondary size-7" />
                  <p className="text-secondary text-xl sm:pt-1">
                    {character?.stats.armor}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <WardIcon className="text-secondary size-7" />
                <p className="text-secondary text-xl sm:pt-1">
                  {character?.stats.ward}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CharacterCardSmall;
