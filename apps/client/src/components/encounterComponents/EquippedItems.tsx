import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import { useContext, useRef } from 'react';
import CloudinaryPicture from '../CloudinaryPicture';
import { Item } from 'src/types/item';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useCombatStore from 'src/stores/combatStore';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCloseBoxOutline } from '@mdi/js';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { useNavigate } from 'react-router-dom';

const EquippedItems = ({
  className,
  setActionSidebar,
}: {
  className?: string;
  setActionSidebar: (state: boolean) => void;
}) => {
  const { rarityColorMap, statColorMap } = useContext(ThemeContext);
  const {
    actionPermissions,
    reactionPermissions,
    controlledCharacterId,
    actionForm,
    removeTarget,
  } = useContext(EncounterContext);
  const navigate = useNavigate();

  const { filteredCharacter: character, isLoading } = useCharacter(
    controlledCharacterId,
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const item = useCombatStore((state) => state.item);
  const setItem = useCombatStore((state) => state.setItem);
  const setRangeData = useCombatStore((state) => state.setRangeData);

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
      <actionForm.Field
        name="item"
        listeners={{
          onChange: () => {
            removeTarget(`character ${controlledCharacterId}`);
            actionForm.setFieldValue('target', null);
          },
        }}
      >
        {(field) => (
          <div
            ref={scrollRef}
            className={`${className} scrollbar-primary-2 col-span-3 flex w-full gap-2 overflow-x-auto`}
            onWheel={handleWheel}
            style={{ overscrollBehavior: 'contain' }}
          >
            {equipmentList.map((equipment) => (
              <button
                key={equipment.id}
                className={`${!equipment.available && 'pointer-events-none'} relative size-20 shrink-0 overflow-hidden rounded border-2 sm:size-28`}
                style={{
                  borderColor:
                    equipment.id === item?.id
                      ? rarityColorMap[equipment.rarity]
                      : `${rarityColorMap[equipment.rarity]}80`,
                }}
                onClick={() => {
                  if (actionPermissions || reactionPermissions) {
                    field.state.value && field.state.value.id === equipment.id
                      ? field.handleChange(null)
                      : field.handleChange(equipment);
                  }
                }}
                onDoubleClick={() => {
                  navigate(
                    `characters/${character.id}/inventory/items/${equipment.id}`,
                  );
                }}
                onMouseEnter={() => {
                  setActionSidebar(true);
                  setItem(equipment);
                  setRangeData({
                    range: equipment.stats.range || 0,
                    color: statColorMap.DMG,
                  });
                }}
                onMouseLeave={() => {
                  if (!field.state.value) {
                    setActionSidebar(false);
                  }
                  setItem(null);
                  setRangeData(null);
                }}
              >
                {!equipment.available && (
                  <Icon
                    path={mdiCloseBoxOutline}
                    size={1.5}
                    className="absolute right-0.5 top-0.5 z-10 text-red-600"
                  />
                )}
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
                  style={{
                    backgroundImage: `radial-gradient(circle, transparent 65%, ${rarityColorMap[equipment.rarity]} 100%)`,
                  }}
                />
                <CloudinaryPicture
                  className={`${!equipment.available && 'opacity-50'} `}
                  publicId={equipment.picture?.publicId}
                />
              </button>
            ))}
          </div>
        )}
      </actionForm.Field>
    )
  );
};

export default EquippedItems;
