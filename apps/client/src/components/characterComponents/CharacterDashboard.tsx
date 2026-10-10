import CharacterList from './CharacterList';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacters from 'src/hooks/useCharacters';
import Page from '../Page';

const CharacterDashboard = () => {
  const { user } = useContext(AuthContext);

  const { characters, filters, setFilters, isLoading } = useCharacters(
    user.characters?.map((character) => character.id) ?? [],
  );

  return (
    <Page title="Character Dashboard">
      <CharacterList
        characters={characters}
        filters={filters}
        setFilters={setFilters}
        isLoading={isLoading}
      />
    </Page>
  );
};

export default CharacterDashboard;
