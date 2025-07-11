import CharacterPictureRound from '../CharacterPictureRound';
import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import useMapStore from 'src/stores/mapStore';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { RefObject, useContext, useRef } from 'react';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import CharacterRadialMenu from '../radialMenus/characterRadialMenu/CharacterRadialMenu';

const CharacterToken = ({
  characterId,
  setDragoverIndex,
}: {
  characterId: number;
  dragImageRef: RefObject;
  setDragoverIndex: (index: number | null) => void;
}) => {
  const { accentPrimary, statColorMap } = useContext(ThemeContext);
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const action = useMapStore((state) => state.action);
  const setRange = useMapStore((state) => state.setRange);
  const setItem = useMapStore((state) => state.setItem);
  const setCharacterId = useMapStore((state) => state.setCharacterId);

  const menuOpen = useRadialMenuStore((state) => state.menuOpen);
  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);
  const setMenu = useRadialMenuStore((state) => state.setMenu);
  const setCoordinates = useRadialMenuStore((state) => state.setCoordinates);

  const containerRef = useRef(null);

  const handleRange = () => {
    if (action?.actionSubtypes.includes('attack')) {
      if (character?.equipment && character?.equipment.weapons.length > 0) {
        const weaponsByRange = character.equipment.weapons.sort(
          (a, b) => a.stats.range - b.stats.range,
        );
        setRange(weaponsByRange[0].stats.range, statColorMap.DMG);
        setItem(weaponsByRange[0]);
      } else {
        setRange(0, accentPrimary);
      }
    } else if (action?.actionSubtypes.includes('movement')) {
      setRange(character?.stats.speed, statColorMap.SPD);
    }
  };

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
      className="group inset-0 z-10 size-12 cursor-grab"
      draggable={true}
      onDragStart={(e) => {
        e.dataTransfer.setData('characterId', characterId.toString());
      }}
      onDragEnd={() => {
        setDragoverIndex(null);
      }}
      onMouseEnter={() => {
        if (action) {
          handleRange();
        }
        setCharacterId(characterId);
      }}
      onMouseLeave={() => {
        if (!menuOpen) {
          setRange(0, accentPrimary);
          setItem(null);
          setCharacterId(null);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleMenu(e);
      }}
    >
      <CharacterRadialMenu character={character} containerRef={containerRef} />
      <CharacterPictureRound
        className="group-hover:border-accent timing size-12 border-2 border-white"
        character={character}
      />
    </div>
  );
};

export default CharacterToken;
