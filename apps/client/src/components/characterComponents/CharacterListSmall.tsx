import { Character } from 'src/types/character';
import ThemeContainer from '../ThemeContainer';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import ArrowHeader3 from '../ArrowHeader3';
import Divider from '../Divider';
import CharacterCardSmall from './CharacterCardSmall';

const CharacterListSmall = ({
  title,
  characters,
}: {
  title: string;
  characters: Character[];
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
      <div className="p-6">
        <ArrowHeader3 title={title} />
        <Divider />
        <div className="flex flex-col gap-4">
          {characters.map((character: Character) => (
            <CharacterCardSmall
              key={character.id}
              characterId={character.id}
              characterList={true}
              expanding={false}
              active={false}
            />
          ))}
        </div>
      </div>
    </ThemeContainer>
  );
};

export default CharacterListSmall;
