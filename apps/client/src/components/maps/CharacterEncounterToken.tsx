import CharacterPictureRound from '../CharacterPictureRound';
import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { useContext, useState } from 'react';
import Die from './Die';
import useCombatStore from 'src/stores/combatStore';
import { FormApi } from '@tanstack/react-form';
import RangeIcon from '../icons/RangeIcon';
import { useDraggable } from '@dnd-kit/core';
import useActions from 'src/hooks/useActions';
import { EncounterContext } from 'src/contexts/EncounterContext';

const CharacterEncounterToken = ({
  characterId,
  locationId,
  onClick,
}: {
  characterId: number;
  locationId: number;
  onClick: () => boolean;
}) => {
  const { statColorMap } = useContext(ThemeContext);
  const {
    combat,
    activeCharacter,
    encounterPermissions,
    rolls,
    rollCounter,
    actionForm,
  } = useContext(EncounterContext);

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const roll = rolls.get(characterId) || null;

  const target = useCombatStore((state) => state.target);
  const damage = useCombatStore((state) => state.damage);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${characterId} ${locationId}`,
    data: { characterId, locationId },
    disabled: activeCharacter.id !== characterId,
  });

  if (isLoading) return <Loading size={1.25} />;

  return (
    <actionForm.Field name="target">
      {(field) => (
        <div
          ref={setNodeRef}
          id={characterId.toString()}
          className="group relative inset-0 size-12 cursor-grab touch-none rounded-full"
          style={
            transform
              ? {
                  transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
                  opacity: '0.5',
                }
              : undefined
          }
          {...listeners}
          {...attributes}
          onClick={() => {
            if (encounterPermissions) {
              if (field.state.value?.id === characterId) {
                field.handleChange(null);
              } else {
                const isInRange = onClick();
                if (!isInRange) {
                  console.log('not in range');
                  return;
                }
                field.handleChange(character);
              }
            }
          }}
        >
          <CharacterPictureRound
            className={`${activeCharacter.id === character?.id && 'activeToken'} ${combat.reactions.includes(characterId) && 'reactiveToken'} group-hover:border-accent timing size-12 border-2 border-white`}
            character={character}
          />
          {roll && rollCounter > 0 && combat.combatPhase !== 'initiative' && (
            <actionForm.Subscribe selector={(state) => state.values.modifiers}>
              {(modifiers: string[]) => (
                <div className="absolute right-1/2 top-0 grid shrink-0 -translate-y-full translate-x-1/2 grid-cols-[repeat(3,_44px)] justify-center gap-2 pb-2">
                  {roll?.diceArray.map((number: number, index: number) => (
                    <Die
                      key={index}
                      size={44}
                      number={number}
                      rolling={roll.rolling}
                      modifiers={modifiers}
                    />
                  ))}
                </div>
              )}
            </actionForm.Subscribe>
          )}
          {target === character?.id && damage !== null && (
            <h2 className="damage text-shadow absolute top-0 flex w-full -translate-y-full justify-center pb-2 text-center font-zen text-shadow-black">
              {damage ? damage : 'Miss'}
            </h2>
          )}
          {field.state.value?.id === characterId && (
            <div className="absolute inset-0 z-10 scale-125">
              <RangeIcon
                className="size-full"
                style={{
                  fill: `${statColorMap.DMG}`,
                  stroke: 'black',
                  strokeWidth: 3,
                }}
              />
            </div>
          )}
        </div>
      )}
    </actionForm.Field>
  );
};

export default CharacterEncounterToken;
