import CharacterList from './CharacterList';
import Container from '../Container';

const CharacterDashboard = () => {
  return (
    <div className="flex w-full max-w-8xl flex-col items-center gap-8">
      <h1 className="text-center">Characters</h1>
      <Container>
        <CharacterList />
      </Container>
    </div>
  );
};

export default CharacterDashboard;
