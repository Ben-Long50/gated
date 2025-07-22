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
import { CampaignContext } from 'src/contexts/CampaignContext';

const CharacterToken = ({
  form,
  setCharacterList,
  encounterPermissions,
  characterId,
  activeCharacterId,
  locationId,
  setDragoverIndex,
}: {
  form: FormApi;
  setCharacterList?: (state: boolean) => void;
  encounterPermissions: boolean;
  characterId: number;
  aciveCharacterId: number;
  locationId: number;
  setDragoverIndex: (index: number | null) => void;
}) => {
  const { accentPrimary, statColorMap } = useContext(ThemeContext);
  const { diceArray, rolling } = useContext(CampaignContext);
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const action = useCombatStore((state) => state.action);
  const setRange = useCombatStore((state) => state.setRange);
  const setItem = useCombatStore((state) => state.setItem);
  const setCharacterId = useMapStore((state) => state.setCharacterId);
  const userCharacter = useCombatStore((state) => state.userCharacter);

  const target = useCombatStore((state) => state.target);
  const damage = useCombatStore((state) => state.damage);

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
          className="tokenEnter group relative inset-0 size-12 cursor-grab rounded-full"
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('characterId', characterId.toString());
            e.dataTransfer.setData('locationId', locationId.toString());
          }}
          onDragEnd={() => {
            setDragoverIndex(null);
          }}
          onMouseEnter={() => {
            if (action && activeCharacterId !== userCharacter) {
              handleRange();
            }
            if (setCharacterList) {
              setCharacterList(true);
            }
            setCharacterId(characterId);
          }}
          onMouseLeave={() => {
            if (setCharacterList) {
              setCharacterList(false);
            }
            setCharacterId(null);
          }}
          onClick={() => {
            if (encounterPermissions) {
              field.handleChange(character);
            }
          }}
        >
          <CharacterPictureRound
            className={`${activeCharacterId === character?.id && 'activeToken'} group-hover:border-accent timing size-12 border-2 border-white`}
            character={character}
          />
          {activeCharacterId === character?.id && (
            <form.Subscribe selector={(state) => state.values.modifiers}>
              {(modifiers: string[]) => (
                <div className="absolute right-1/2 top-0 grid shrink-0 -translate-y-full translate-x-1/2 grid-cols-[repeat(3,_44px)] justify-center gap-2 pb-2">
                  {diceArray?.map((number: number, index: number) => (
                    <Die
                      key={index}
                      size={44}
                      number={number}
                      rolling={rolling}
                      modifiers={modifiers}
                    />
                  ))}
                </div>
              )}
            </form.Subscribe>
          )}
          {target === character?.id && damage !== null && (
            <h2 className="damage text-shadow absolute top-0 w-full -translate-y-full pb-2 text-center font-zen text-shadow-black">
              {damage ? damage : 'Miss'}
            </h2>
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
