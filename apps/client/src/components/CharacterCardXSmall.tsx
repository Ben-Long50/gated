import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from './CharacterPictureRound';
import Loading from './Loading';
import ArrowHeader4 from './ArrowHeader4';
import { useRef } from 'react';
import CharacterRadialMenu from './radialMenus/characterRadialMenu/CharacterRadialMenu';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import constructName from 'src/utils/constructName';

const CharacterCardXSmall = ({
  characterList,
  characterId,
  className,
  active,
  menu = true,
}: {
  characterList: boolean;
  characterId: number;
  className?: string;
  active: boolean;
  menu?: boolean;
}) => {
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);
  const containerRef = useRef(null);

  const menuOpen = useRadialMenuStore((state) => state.menuOpen);
  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);
  const setMenu = useRadialMenuStore((state) => state.setMenu);
  const setCoordinates = useRadialMenuStore((state) => state.setCoordinates);

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
      className={`${className} ${menu && 'cursor-pointer'} timing relative flex flex-col`}
      onClick={(e) => {
        e.stopPropagation();
        handleMenu(e);
      }}
    >
      {menu && (
        <CharacterRadialMenu
          character={character}
          containerRef={containerRef}
        />
      )}
      <div className={`relative flex items-center gap-4`}>
        <CharacterPictureRound
          className={`${active && 'liveToken'}`}
          character={character}
        />
        {character?.conditions && character?.conditions.length > 0 && (
          <div className="absolute left-0 top-0 z-10 size-3 rounded-full bg-red-600 shadow-md shadow-black"></div>
        )}
        <ArrowHeader4
          className={`${characterList ? 'visible h-8 translate-x-0 opacity-100' : 'invisible h-0 -translate-x-full opacity-0'} ${active ? 'text-accent' : 'text-primary'} timing w-full`}
          title={constructName(character)}
        />
      </div>
    </div>
  );
};

export default CharacterCardXSmall;
