import CharacterPictureRound from '../CharacterPictureRound';
import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import { useContext } from 'react';
import Die from './Die';
import useCombatStore from 'src/stores/combatStore';
import RangeIcon from '../icons/RangeIcon';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { socket } from 'src/socket';
import { useNavigate, useParams } from 'react-router-dom';
import { Location } from 'src/types/map';
import isInRange from './encounterUtils/isInRange';
import { ActionData } from 'src/types/actionData';
import { ThemeContext } from 'src/contexts/ThemeContext';

const CharacterEncounterToken = ({
  location,
  activeCoordinates,
  rangeData,
  height,
  mapScale,
  insertTarget,
  tokenDragStart,
  handleDragUpdate,
  handleDragEnd,
  handleRemoveTarget,
}: {
  location: Location;
  activeCoordinates: { row: number; col: number } | null;
  rangeData: ActionData;
  height: number;
  mapScale: number;
  insertTarget?: (
    targetRow: number,
    targetCol: number,
    inRange: boolean,
    color: string,
    targetId?: number,
  ) => void;
  tokenDragStart?: (row: number, col: number, characterId: number) => void;
  handleDragUpdate?: (
    row: number,
    col: number,
    color: string,
    targetId?: number,
    inRange?: boolean | null,
  ) => void;
  handleDragEnd?: () => void;
  handleRemoveTarget?: (characterId?: number) => void;
}) => {
  const {
    combat,
    combatLoading,
    activeCharacter,
    controlledCharacter,
    actionPermissions,
    reactionPermissions,
    rolls,
    actionForm,
    reactionForm,
    removeTarget,
  } = useContext(EncounterContext);
  const { statColorMap } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { encounterId } = useParams();

  const { filteredCharacter: character, isLoading } = useCharacter(
    location.characterId,
  );

  const form = actionPermissions
    ? actionForm
    : reactionPermissions
      ? reactionForm
      : actionForm;

  const roll = rolls.get(location.characterId) || null;

  const setRangeData = useCombatStore((state) => state.setRangeData);

  const inRange = activeCoordinates
    ? isInRange(
        activeCoordinates,
        { row: location.row, col: location.col },
        rangeData.range,
      )
    : false;

  if (isLoading || combatLoading) return <Loading size={1.25} />;

  return (
    <form.Field name="target">
      {(field) => (
        <div
          draggable={false}
          id={`character ${location.characterId}`}
          className="token group relative size-12 shrink-0 cursor-grab touch-none rounded-full"
          style={{
            gridRow: location.row,
            gridColumn: location.col,
            height: `${48 * mapScale * 0.9}px`,
            width: `${48 * mapScale * 0.9}px`,
          }}
          onClick={(e) => {
            e.stopPropagation();

            if (
              (actionPermissions || reactionPermissions) &&
              rangeData.requirements.includes('target')
            ) {
              if (field.state.value?.id === location.characterId) {
                field.handleChange(null);
                removeTarget(`character ${controlledCharacter?.id}`);
                socket.emit('removeTarget', {
                  encounterId: Number(encounterId),
                  key: `character ${controlledCharacter?.id}`,
                });
              } else if (actionPermissions || reactionPermissions) {
                if (!inRange) {
                  console.log('not in range');
                  return;
                }
                field.handleChange(character);
              }
            }
            if (insertTarget) {
              insertTarget(
                location.row,
                location.col,
                inRange,
                statColorMap.DMG,
                location.characterId,
              );
            }
          }}
          onDoubleClick={
            handleRemoveTarget
              ? (e) => {
                  e.stopPropagation();
                  handleRemoveTarget(location.characterId);
                }
              : (e) => {
                  e.stopPropagation();
                  navigate(`characters/${location.characterId}`);
                }
          }
          onMouseDown={() => {
            if (tokenDragStart) {
              tokenDragStart(location.row, location.col, location.characterId);
            }
          }}
          onMouseEnter={() => {
            if (handleDragUpdate) {
              handleDragUpdate(
                location.row,
                location.col,
                rangeData.color,
                location.characterId,
                inRange,
              );
            } else if (
              controlledCharacter.id === character?.id &&
              actionPermissions
            ) {
              setRangeData({
                range: character?.stats.speed,
                color: statColorMap.SPD,
              });
            }
          }}
          onMouseUp={() => {
            if (handleDragEnd) {
              handleDragEnd();
            }
          }}
          onMouseLeave={() => {
            if (activeCharacter.id === character?.id) {
              setRangeData(null);
            }
          }}
        >
          <CharacterPictureRound
            className={`${activeCharacter.id === character?.id && 'activeToken'} ${combat?.reactions.includes(location.characterId) && 'reactiveToken'} group-hover:border-accent timing size-full border-2 border-white`}
            character={character}
          />
          {roll && combat.combatPhase !== 'initiative' && (
            <div
              className={`${location.row > height / 2 ? 'bottom-1/2' : 'top-1/2'} absolute right-1/2 grid shrink-0 grid-cols-[repeat(3,_44px)] justify-center gap-2`}
              style={{
                transform:
                  location.row > height / 2
                    ? 'translateY(-36px) translateX(50%)'
                    : 'translateY(36px) translateX(50%)',
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
    </form.Field>
  );
};

export default CharacterEncounterToken;
