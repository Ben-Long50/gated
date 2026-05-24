import { Character } from 'src/types/character';
import constructName from 'src/utils/constructName';
import NpcTypeList from '../NpcTypeList';

const CharacterHeader = ({
  character,
  className,
}: {
  character: Character;
  className: string;
}) => {
  return (
    <div
      className={`${className} flex w-full items-center justify-between gap-8`}
    >
      <div className="flex items-center justify-start gap-4">
        <p className="font-zen text-4xl">{constructName(character)}</p>
        <NpcTypeList npcTypes={character?.npcTypes} />
      </div>
      <p className="!text-accent font-zen text-4xl">Level {character?.level}</p>
    </div>
  );
};

export default CharacterHeader;
