import useCodexCharactersQuery from 'src/hooks/useCodexCharactersQuery/useCodexCharactersQuery';
import CharacterList from './CharacterList';
import Loading from '../Loading';

const CodexCharacters = () => {
  const { data: codexCharacters, isLoading } = useCodexCharactersQuery();

  const codexCharacterIds =
    codexCharacters?.map((character) => character.id) || [];

  if (isLoading) {
    return <Loading />;
  }

  return <CharacterList characterIds={codexCharacterIds} menu={false} />;
};

export default CodexCharacters;
