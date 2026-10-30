import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from './CharacterPictureRound';
import CharacterStatBars from './CharacterStatBars';
import Loading from '../Loading';
import ArrowHeader4 from '../ArrowHeader4';
import useMapStore from 'src/stores/mapStore';
import { useRef } from 'react';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import Icon from '@mdi/react';
import { mdiCrown } from '@mdi/js';
import StatBarContainer from '../StatBarContainer';

const CharacterCardSmall = ({
  characterListOpen,
  characterId,
  className,
  expanding,
  active,
}: {
  characterListOpen: boolean;
  characterId: number;
  className?: string;
  expanding: boolean;
  active: boolean;
}) => {
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

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

  if (isLoading) return <Loading size={1.25} />;

  return (
    <div
      ref={containerRef}
      className={`${className} timing relative flex flex-col`}
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
      <div className="mb-2 flex items-center justify-between gap-8">
        <ArrowHeader4
          className={`${characterListOpen ? 'visible h-8 translate-x-0 opacity-100' : 'invisible h-0 -translate-x-full opacity-0'} ${active ? 'text-accent' : 'text-primary'} timing w-full`}
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
        <StatBarContainer size="small">
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
    </div>
  );
};

export default CharacterCardSmall;
