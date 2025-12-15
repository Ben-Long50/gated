import CharacterPictureRound from '../CharacterPictureRound';
import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { useContext, useMemo } from 'react';
import Die from './Die';
import useCombatStore from 'src/stores/combatStore';
import RangeIcon from '../icons/RangeIcon';
import { useDraggable } from '@dnd-kit/core';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { socket } from 'src/socket';
import { useParams } from 'react-router-dom';
import { Location } from 'src/types/map';
import isInRange from './encounterUtils/isInRange';

const CharacterEncounterToken = ({
  location,
  activeCoordinates,
  range,
  height,
  mapScale,
}: {
  location: Location;
  activeCoordinates: { row: number; col: number } | null;
  range: number;
  height: number;
  mapScale: number;
}) => {
  const { statColorMap } = useContext(ThemeContext);
  const { combat, activeCharacter, encounterPermissions, rolls, actionForm } =
    useContext(EncounterContext);
  const { encounterId } = useParams();

  const { filteredCharacter: character, isLoading } = useCharacter(
    location.characterId,
  );

  const roll = rolls.get(location.characterId) || null;

  const target = useCombatStore((state) => state.target);
  const damage = useCombatStore((state) => state.damage);
  const setRange = useCombatStore((state) => state.setRange);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${location.characterId} ${location.id}`,
    data: {
      characterId: location.characterId,
      locationId: location.id,
      row: location.row,
      col: location.col,
    },
    disabled: activeCharacter?.id !== location.characterId,
  });

  if (isLoading) return <Loading size={1.25} />;

  return (
    <actionForm.Field name="target">
      {(field) => (
        <div
          ref={setNodeRef}
          id={location.characterId.toString()}
          className="token group relative inset-0 size-12 cursor-grab touch-none rounded-full"
          style={
            transform
              ? {
                  transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
                  height: `${48 * mapScale * 0.9}px`,
                  width: `${48 * mapScale * 0.9}px`,
                }
              : {
                  height: `${48 * mapScale * 0.9}px`,
                  width: `${48 * mapScale * 0.9}px`,
                }
          }
          {...listeners}
          {...attributes}
          onClick={(e) => {
            e.stopPropagation();
            if (encounterPermissions) {
              if (field.state.value?.id === location.characterId) {
                field.handleChange(null);
                socket.emit('changeTarget', {
                  encounterId: Number(encounterId),
                  characterId: null,
                });
              } else {
                const inRange = activeCoordinates
                  ? isInRange(
                      activeCoordinates,
                      { row: location.row, col: location.col },
                      range,
                    )
                  : false;
                if (!inRange) {
                  console.log('not in range');
                  return;
                }
                socket.emit('changeTarget', {
                  encounterId: Number(encounterId),
                  characterId: location.characterId,
                });
                field.handleChange(character);
              }
            }
          }}
          onMouseEnter={() => {
            if (activeCharacter.id === character?.id) {
              setRange(character?.stats.speed, statColorMap.SPD);
            }
          }}
          onMouseLeave={() => {
            if (activeCharacter.id === character?.id) {
              setRange(0, 'transparent');
            }
          }}
        >
          <CharacterPictureRound
            className={`${activeCharacter.id === character?.id && 'activeToken'} ${combat.reactions.includes(location.characterId) && 'reactiveToken'} group-hover:border-accent timing size-12 size-full border-2 border-white`}
            character={character}
          />
          {roll && combat.combatPhase !== 'initiative' && (
            <div
              className="absolute right-1/2 top-1/2 grid shrink-0 grid-cols-[repeat(3,_44px)] justify-center gap-2"
              style={{
                transform:
                  location.row > height / 2
                    ? 'translateY(-50%) translateY(-100%)  translateX(50%)'
                    : 'translateY(-50%) translateY(100%)  translateX(50%)',
              }}
            >
              {roll?.diceArray.map((number: number, index: number) => (
                <Die
                  key={index}
                  size={44}
                  number={number}
                  rolling={roll.rolling}
                  modifiers={roll.modifiers}
                />
              ))}
            </div>
          )}
          {target === character?.id && damage !== null && (
            <h2 className="damage text-shadow absolute top-0 flex w-full -translate-y-full justify-center pb-2 text-center font-zen text-shadow-black">
              {damage ? damage : 'Miss'}
            </h2>
          )}
          {field.state.value?.id === location.characterId && (
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
