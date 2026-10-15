import useSocialCharactersQuery from 'src/hooks/social hooks/useCharactersQuery/useSocialCharactersQuery';
import CharacterList from './characterComponents/CharacterList';

const SocialCharacters = () => {
  const { data: characters } = useSocialCharactersQuery();

  return (
    <CharacterList
      characterIds={characters?.map((character) => character.id)}
    />
  );
};

export default SocialCharacters;
