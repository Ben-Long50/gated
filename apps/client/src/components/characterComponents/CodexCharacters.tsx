import useCodexCharactersQuery from 'src/hooks/useCodexCharactersQuery/useCodexCharactersQuery';
import CharacterList from './CharacterList';
import useCharacters from 'src/hooks/useCharacters';
import Page from '../Page';

const CodexCharacters = () => {
  const { data: codexCharacters } = useCodexCharactersQuery();

  const { characters, filters, setFilters, isLoading } = useCharacters(
    codexCharacters?.map((character) => character.id) ?? [],
  );

  return (
    <Page title="Characters">
      <CharacterList
        characters={characters}
        filters={filters}
        setFilters={setFilters}
        isLoading={isLoading}
      />
    </Page>
  );
};

export default CodexCharacters;
