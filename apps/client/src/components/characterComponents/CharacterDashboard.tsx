import CharacterList from './CharacterList';
import Container from '../Container';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacters from 'src/hooks/useCharacters';

const CharacterDashboard = () => {
  const { user } = useContext(AuthContext);

  const { characters, filters, setFilters, isLoading } = useCharacters(
    user.characters?.map((character) => character.id) ?? [],
  );

  return (
    <div className="flex w-full max-w-8xl flex-col items-center gap-8">
      <h1 className="text-center">Characters</h1>
      <Container>
        <CharacterList
          characters={characters}
          filters={filters}
          setFilters={setFilters}
          isLoading={isLoading}
        />
      </Container>
    </div>
  );
};

export default CharacterDashboard;
