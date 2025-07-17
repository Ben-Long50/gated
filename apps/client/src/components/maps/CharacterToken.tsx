import CharacterPictureRound from '../CharacterPictureRound';
import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import useMapStore from 'src/stores/mapStore';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { useContext } from 'react';
import Die from './Die';
import useCombatStore from 'src/stores/combatStore';
import { FormApi } from '@tanstack/react-form';
import RangeIcon from '../icons/RangeIcon';

const CharacterToken = ({
  form,
  characterId,
  locationId,
  setDragoverIndex,
  diceArray,
  rolling,
}: {
  form: FormApi;
  characterId: number;
  locationId: number;
  setDragoverIndex: (index: number | null) => void;
  diceArray: number[];
  rolling: boolean;
}) => {
  const { accentPrimary, statColorMap } = useContext(ThemeContext);
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const action = useCombatStore((state) => state.action);
  const setRange = useCombatStore((state) => state.setRange);
  const setItem = useCombatStore((state) => state.setItem);
  const setCharacterId = useMapStore((state) => state.setCharacterId);
  const userCharacter = useCombatStore((state) => state.userCharacter);

  const activeCharacter = useCombatStore((state) => state.activeCharacter);

  const handleRange = () => {
    if (action?.actionSubtypes.includes('attack')) {
      if (character?.equipment && character?.equipment.weapons.length > 0) {
        const weaponsByRange = character.equipment.weapons.sort(
          (a, b) => b.stats.range - a.stats.range,
        );
        setRange(Math.ceil(weaponsByRange[0].stats.range), statColorMap.DMG);
        setItem(weaponsByRange[0], false);
      } else {
        setRange(0, accentPrimary);
      }
    } else if (action?.actionSubtypes.includes('movement')) {
      setRange(character?.stats.speed, statColorMap.SPD);
    }
  };

  if (isLoading) return <Loading size={1.25} />;

  return (
    <form.Field name="target">
      {(field) => (
        <div
          className="tokenEnter group relative inset-0 z-10 size-12 cursor-grab"
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('characterId', characterId.toString());
            e.dataTransfer.setData('locationId', locationId.toString());
          }}
          onDragEnd={() => {
            setDragoverIndex(null);
          }}
          onMouseEnter={() => {
            if (action && activeCharacter !== userCharacter) {
              handleRange();
            }
            setCharacterId(characterId);
          }}
          onMouseLeave={() => {
            setCharacterId(null);
          }}
          onClick={() => {
            if (
              activeCharacter === userCharacter &&
              userCharacter !== characterId
            ) {
              field.handleChange(character);
            }
          }}
        >
          <CharacterPictureRound
            className={`${activeCharacter === character?.id && 'activeToken'} group-hover:border-accent timing size-12 border-2 border-white`}
            character={character}
          />
          {activeCharacter === character?.id && (
            <div className="absolute right-1/2 top-0 flex shrink-0 -translate-y-full translate-x-1/2 justify-center gap-2 pb-2">
              {diceArray?.map((number: number, index) => (
                <Die key={index} size={44} number={number} rolling={rolling} />
              ))}
            </div>
          )}
          {field.state.value?.id === characterId && (
            <div className="absolute inset-0 scale-125">
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

export default CharacterToken;
