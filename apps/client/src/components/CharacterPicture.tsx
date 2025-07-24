import { useContext } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import CloudinaryImage from './CloudinaryImage';
import { Character } from 'src/types/character';
import InjuryIcon from './icons/InjuryIcon';

const CharacterPicture = ({
  character,
  className,
}: {
  character: Character;
  className?: string;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const awol =
    (typeof character.stats.injuries === 'number' &&
      character.stats.injuries >= character.stats.permanentInjuries) ||
    false;

  return (
    <ThemeContainer
      className="aspect-square"
      chamfer="medium"
      borderColor={accentPrimary}
      overflowHidden={true}
    >
      <CloudinaryImage
        className={`${className} ${awol && 'grayscale'}`}
        publicId={character?.picture?.publicId}
        position={character?.picture?.position}
      />
      {awol && (
        <InjuryIcon className="absolute left-2 top-4 size-20 fill-black stroke-red-600 stroke-2 p-0.5" />
      )}
    </ThemeContainer>
  );
};

export default CharacterPicture;
