import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from './CharacterPictureRound';
import Loading from './Loading';
import ArrowHeader4 from './ArrowHeader4';
import { useRef, useState } from 'react';
import CharacterRadialMenu from './radialMenus/characterRadialMenu/CharacterRadialMenu';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import LocationIcon from './icons/LocationIcon';
import { DragOverlay, useDraggable } from '@dnd-kit/core';

const CharacterLocationCard = ({
  characterId,
  locationList,
  className,
}: {
  characterId: number;
  locationList: boolean;
  className?: string;
}) => {
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  const menuOpen = useRadialMenuStore((state) => state.menuOpen);
  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);
  const setMenu = useRadialMenuStore((state) => state.setMenu);
  const setCoordinates = useRadialMenuStore((state) => state.setCoordinates);

  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: characterId,
    data: {
      characterId: character?.id,
      locationId: character?.locationId || null,
    },
  });

  const handleMenu = (e: MouseEvent) => {
    if (!setNodeRef.current) return;
    setMenu('character', 'large', characterId);

    const rect = setNodeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!menuOpen) {
      setCoordinates(x, y);
    }
    setMenuOpen(!menuOpen);
  };

  if (isLoading) return <Loading size={1.25} />;

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`${className} group relative flex cursor-pointer flex-col`}
        onClick={(e) => {
          e.stopPropagation();
          handleMenu(e);
        }}
      >
        <CharacterRadialMenu
          character={character}
          containerRef={containerRef}
        />
        <div className={`relative flex items-center gap-8`}>
          <CharacterPictureRound character={character} />
          <div className="flex flex-col">
            <ArrowHeader4
              className={`${locationList ? 'visible h-8 translate-x-0 opacity-100' : 'invisible h-0 -translate-x-full opacity-0'} text-primary timing group-hover:text-accent w-full`}
              title={`${character?.firstName} ${character?.lastName}`}
            />
            <div className="flex items-center gap-4">
              <LocationIcon className="text-accent size-5" />
              <h4 className="!text-accent">
                {character?.location ? character.location.map.name : 'N/A'}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterLocationCard;
