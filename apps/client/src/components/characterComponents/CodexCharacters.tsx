import useCodexCharactersQuery from 'src/hooks/useCodexCharactersQuery/useCodexCharactersQuery';
import CharacterList from './CharacterList';
import useCharacters from 'src/hooks/useCharacters';

const CodexCharacters = () => {
  const { data: codexCharacters } = useCodexCharactersQuery();

  const { characters, filters, setFilters, isLoading } = useCharacters(
    codexCharacters?.map((character) => character.id) ?? [],
  );

  return (
    <CharacterList
      characters={characters}
      filters={filters}
      setFilters={setFilters}
      isLoading={isLoading}
    />
  );
};

export default CodexCharacters;
