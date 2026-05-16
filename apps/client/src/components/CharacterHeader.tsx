import { Character } from 'src/types/character';
import constructName from 'src/utils/constructName';
import NpcTypeList from './NpcTypeList';

const CharacterHeader = ({ character }: { character: Character }) => {
  return (
    <div className="flex w-full items-center justify-between gap-8">
      <div className="flex items-center justify-start gap-4">
        <h2 className="text-5xl font-bold tracking-widest">
          {constructName(character)}
        </h2>
        <NpcTypeList npcTypes={character?.npcTypes} />
      </div>
      <p className="!text-accent text-5xl font-bold tracking-widest">
        {character?.level}
      </p>
    </div>
  );
};

export default CharacterHeader;
