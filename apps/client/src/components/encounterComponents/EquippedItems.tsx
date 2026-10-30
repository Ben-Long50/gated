import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import { useContext, useRef } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useCombatStore from 'src/stores/combatStore';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { useNavigate } from 'react-router-dom';
import { PictureCard } from '../PictureCard';

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

  if (isLoading || !character?.equipment) return <Loading size={1.5} />;

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
            className={`${className} scrollbar-primary-2 col-span-3 flex w-full justify-start gap-2 overflow-x-auto`}
            onWheel={handleWheel}
            style={{ overscrollBehavior: 'contain' }}
          >
            {character.equipment.map((equipment) => (
              <PictureCard
                className={`${!equipment.available && 'pointer-events-none'} w-[200px]`}
                label={equipment.name}
                publicId={equipment.generatedPicture.publicId}
                key={equipment.id}
                color={rarityColorMap[equipment.rarity]}
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
              />
            ))}
          </div>
        )}
      </actionForm.Field>
    )
  );
};

export default EquippedItems;
