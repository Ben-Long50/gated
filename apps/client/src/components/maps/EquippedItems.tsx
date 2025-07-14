import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import { useContext, useRef } from 'react';
import ItemMenu from '../ItemMenu';
import CloudinaryImage from '../CloudinaryImage';
import { Item } from 'src/types/item';
import useMapStore from 'src/stores/mapStore';
import { ThemeContext } from 'src/contexts/ThemeContext';

const EquippedItems = ({ characterId }: { characterId: number }) => {
  const { rarityColorMap } = useContext(ThemeContext);
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const scrollRef = useRef<HTMLDivElement>(null);

  const item = useMapStore((store) => store.item);
  const setItem = useMapStore((store) => store.setItem);

  const timeoutRef = useRef<number | null>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    scrollRef.current?.scrollBy({
      left: e.deltaY * 4,
      behavior: 'auto',
    });
  };

  let equipmentList = [] as Item[];

  if (isLoading || !character?.equipment) return <Loading size={1.5} />;

  Object.values(character?.equipment).forEach((itemArray) => {
    equipmentList = [...equipmentList, ...itemArray];
  });

  return (
    character?.equipment && (
      <div
        ref={scrollRef}
        className="scrollbar-primary-2 col-span-3 flex w-full gap-2 overflow-x-auto"
        onWheel={handleWheel}
        style={{ overscrollBehavior: 'contain' }}
      >
        {equipmentList.map((equipment, index) => (
          <button
            key={index}
            className="relative size-28 overflow-hidden rounded border-2"
            style={{
              borderColor:
                equipment.id === item?.id
                  ? rarityColorMap[equipment.rarity]
                  : `${rarityColorMap[equipment.rarity]}80`,
            }}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              setItem(equipment);
            }}
            onMouseLeave={() => {
              timeoutRef.current = setTimeout(() => setItem(null), 500);
            }}
          >
            <div
              className="absolute inset-0 z-10 opacity-50"
              style={{
                backgroundImage: `radial-gradient(circle, transparent 65%, ${rarityColorMap[equipment.rarity]} 100%)`,
              }}
            />
            <CloudinaryImage publicId={equipment.picture.publicId} />
          </button>
        ))}
      </div>
    )
  );
};

export default EquippedItems;
