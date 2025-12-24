import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader4 from '../ArrowHeader4';

const CharacterName = ({ characterId }: { characterId: number }) => {
  const { filteredCharacter: character } = useCharacter(characterId);

  const characterName = character?.lastName
    ? character?.firstName + ' ' + character?.lastName
    : character?.firstName;

  return (
    <div className="flex items-center gap-4">
      <CharacterPictureRound character={character} />
      <ArrowHeader4 className="text-primary" title={characterName} />
    </div>
  );
};

export default CharacterName;
