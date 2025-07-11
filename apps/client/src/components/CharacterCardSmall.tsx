import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from './CharacterPictureRound';
import CharacterStatBars from './CharacterStatBars';
import Loading from './Loading';
import ArrowHeader4 from './ArrowHeader4';

const CharacterCardSmall = ({ characterId }: { characterId: number }) => {
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  if (isLoading) return <Loading size={1.25} />;

  return (
    <div className="bg-primary flex max-w-96 grow flex-col gap-1 truncate rounded p-2 px-3 shadow-md shadow-black">
      <ArrowHeader4 title={`${character.firstName} ${character.lastName}`} />
      <div className="flex w-full items-center gap-4">
        <CharacterPictureRound character={character} />
        <div className="grid w-full grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-0">
          <CharacterStatBars
            characterId={character.id}
            size="small"
            stats={{
              currentHealth: character.stats.currentHealth,
              maxHealth: character.stats.maxHealth,
              currentSanity: character.stats.currentSanity,
              maxSanity: character.stats.maxSanity,
            }}
            cardWidth={300}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterCardSmall;
