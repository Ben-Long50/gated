import { Character } from 'src/types/character';
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
      className={`${className} flex flex-col items-start justify-between gap-2`}
    >
      <div className="flex items-center justify-start gap-4">
        <p className="font-zen text-5xl">{character?.name}</p>
        <NpcTypeList npcTypes={character?.npcTypes} />
      </div>
      {character?.title && (
        <p className="text-tertiary font-semibold">{character?.title}</p>
      )}
      {character?.playerCharacter ? (
        <p className="!text-accent font-zen text-3xl">
          Level {character?.level}
        </p>
      ) : (
        <p className="!text-accent font-zen text-3xl">NPC</p>
      )}
    </div>
  );
};

export default CharacterHeader;
