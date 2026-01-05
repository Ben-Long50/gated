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
import statColorMap from 'src/utils/statColorMap';

const CharacterEncounterToken = ({
  location,
  activeCoordinates,
  rangeData,
  height,
  mapScale,
  handleInsertArrow,
  handleDragStart,
  handleDragUpdate,
  handleRemoveTarget,
}: {
  location: Location;
  activeCoordinates: { row: number; col: number } | null;
  rangeData: { range: number; color: string };
  height: number;
  mapScale: number;
  handleInsertArrow?: (
    row: number,
    col: number,
    characterId: number,
    targetRow: number,
    targetCol: number,
    targetId: number,
    inRange: boolean,
  ) => void;
  handleDragStart?: (row: number, col: number, characterId?: number) => void;
  handleDragUpdate?: (row: number, col: number, targetId?: number) => void;
  handleRemoveTarget?: (characterId?: number) => void;
}) => {
  const {
    combat,
    combatLoading,
    activeCharacter,
    encounterPermissions,
    rolls,
    actionForm,
    setTarget,
    removeTarget,
  } = useContext(EncounterContext);
  const navigate = useNavigate();
  const { encounterId } = useParams();

  const { filteredCharacter: character, isLoading } = useCharacter(
    location.characterId,
  );

  const roll = rolls.get(location.characterId) || null;

  const setRangeData = useCombatStore((state) => state.setRangeData);

  if (isLoading || combatLoading) return <Loading size={1.25} />;

  return (
    <actionForm.Field name="target">
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
            if (encounterPermissions) {
              if (field.state.value?.id === location.characterId) {
                field.handleChange(null);
                removeTarget(`character ${activeCharacter.id}`);
                socket.emit('removeTarget', {
                  encounterId: Number(encounterId),
                  activeId: `character ${activeCharacter?.id}`,
                });
              } else if (combat.combatPhase === 'action') {
                const inRange = activeCoordinates
                  ? isInRange(
                      activeCoordinates,
                      { row: location.row, col: location.col },
                      rangeData.range,
                    )
                  : false;
                if (!inRange) {
                  console.log('not in range');
                  return;
                }

                if (handleInsertArrow) {
                  handleInsertArrow(
                    activeCharacter.location.row,
                    activeCharacter.location.col,
                    activeCharacter.id,
                    location.row,
                    location.col,
                    location.characterId,
                    inRange,
                  );
                }
                field.handleChange(character);
              }
            }
          }}
          onDoubleClick={
            handleRemoveTarget
              ? () => handleRemoveTarget(location.characterId)
              : () => navigate(`characters/${location.characterId}`)
          }
          onMouseDown={
            handleDragStart
              ? () =>
                  handleDragStart(
                    location.row,
                    location.col,
                    location.characterId,
                  )
              : undefined
          }
          onMouseEnter={() => {
            if (handleDragUpdate) {
              handleDragUpdate(
                location.row,
                location.col,
                location.characterId,
              );
            } else if (activeCharacter.id === character?.id) {
              setRangeData({
                range: character?.stats.speed,
                color: statColorMap.SPD,
              });
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
    </actionForm.Field>
  );
};

export default CharacterEncounterToken;
