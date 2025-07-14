import CharacterPictureRound from '../CharacterPictureRound';
import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import useMapStore from 'src/stores/mapStore';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { useContext } from 'react';
import { Character } from 'src/types/character';
import Die from './Die';

const CharacterToken = ({
  activeCharacter,
  characterId,
  locationId,
  setDragoverIndex,
  diceArray,
  rolling,
}: {
  activeCharacter: Partial<Character>;
  characterId: number;
  locationId: number;
  setDragoverIndex: (index: number | null) => void;
  diceArray: number[];
  rolling: boolean;
}) => {
  const { accentPrimary, statColorMap } = useContext(ThemeContext);
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const action = useMapStore((state) => state.action);
  const setRange = useMapStore((state) => state.setRange);
  const setItem = useMapStore((state) => state.setItem);
  const setCharacterId = useMapStore((state) => state.setCharacterId);

  const handleRange = () => {
    if (action?.actionSubtypes.includes('attack')) {
      if (character?.equipment && character?.equipment.weapons.length > 0) {
        const weaponsByRange = character.equipment.weapons.sort(
          (a, b) => b.stats.range - a.stats.range,
        );
        setRange(Math.ceil(weaponsByRange[0].stats.range), statColorMap.DMG);
        setItem(weaponsByRange[0]);
      } else {
        setRange(0, accentPrimary);
      }
    } else if (action?.actionSubtypes.includes('movement')) {
      setRange(character?.stats.speed, statColorMap.SPD);
    }
  };

  if (isLoading) return <Loading size={1.25} />;

  return (
    <div
      className="group relative inset-0 z-10 size-12 cursor-grab"
      draggable={true}
      onDragStart={(e) => {
        e.dataTransfer.setData('characterId', characterId.toString());
        e.dataTransfer.setData('locationId', locationId.toString());
      }}
      onDragEnd={() => {
        setDragoverIndex(null);
      }}
      onMouseEnter={() => {
        if (action) {
          handleRange();
        }
        setCharacterId(characterId);
      }}
      onMouseLeave={() => {
        setRange(0, accentPrimary);
        setItem(null);
        setCharacterId(null);
      }}
    >
      <CharacterPictureRound
        className="group-hover:border-accent timing size-12 border-2 border-white"
        character={character}
      />
      {activeCharacter?.id === character?.id && (
        <div className="absolute right-1/2 top-0 flex shrink-0 -translate-y-full translate-x-1/2 justify-center gap-2 pb-2">
          {diceArray?.map((number: number, index) => (
            <Die key={index} size={44} number={number} rolling={rolling} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterToken;
