import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import { useContext, useRef } from 'react';
import CloudinaryImage from '../CloudinaryImage';
import { Item } from 'src/types/item';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useCombatStore from 'src/stores/combatStore';
import Icon from '@mdi/react';
import { mdiCheckCircle } from '@mdi/js';
import { FormApi } from '@tanstack/react-form';

const EquippedItems = ({
  form,
  setActionSidebar,
  encounterPermissions,
  characterId,
}: {
  form: FormApi;
  setActionSidebar: (state: boolean) => void;
  encounterPermissions: boolean;
  characterId: number;
}) => {
  const { rarityColorMap, statColorMap } = useContext(ThemeContext);
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>(null);

  const item = useCombatStore((state) => state.item);
  const setItem = useCombatStore((state) => state.setItem);
  const setRange = useCombatStore((state) => state.setRange);

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
      <form.Field name="item">
        {(field) => (
          <div
            ref={scrollRef}
            className="scrollbar-primary-2 col-span-3 flex w-full gap-2 overflow-x-auto"
            onWheel={handleWheel}
            style={{ overscrollBehavior: 'contain' }}
          >
            {equipmentList.map((equipment, index) => (
              <button
                key={index}
                className={`relative size-20 shrink-0 overflow-hidden rounded border-2 sm:size-28`}
                style={{
                  borderColor:
                    equipment.id === item?.id
                      ? rarityColorMap[equipment.rarity]
                      : `${rarityColorMap[equipment.rarity]}80`,
                }}
                onClick={() => {
                  if (encounterPermissions) {
                    field.state.value && field.state.value.id === equipment.id
                      ? field.handleChange(null)
                      : field.handleChange(equipment);
                  }
                  setItem(equipment);
                }}
                onMouseEnter={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setActionSidebar(true);
                  setItem(equipment);
                  setRange(equipment.stats.range || null, statColorMap.DMG);
                }}
                onMouseLeave={() => {
                  if (field.state.value) {
                    timeoutRef.current = setTimeout(() => {
                      setItem(field.state.value);
                      setRange(null, null);
                    }, 200);
                  } else {
                    setActionSidebar(false);
                    setItem(null);
                    setRange(null, null);
                  }
                }}
              >
                {field.state.value?.id === equipment.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Icon
                      className="text-tertiary"
                      path={mdiCheckCircle}
                      size={3}
                    />
                  </div>
                )}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: `radial-gradient(circle, transparent 65%, ${rarityColorMap[equipment.rarity]} 100%)`,
                  }}
                />
                <CloudinaryImage publicId={equipment.picture.publicId} />
              </button>
            ))}
          </div>
        )}
      </form.Field>
    )
  );
};

export default EquippedItems;
