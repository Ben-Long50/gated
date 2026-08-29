import { ReactNode, useContext } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Character } from 'src/types/character';
import InjuryIcon from '../icons/InjuryIcon';
import InsanityIcon from '../icons/InsanityIcon';
import CloudinaryPicture from '../CloudinaryPicture';

const CharacterPicture = ({
  character,
  children,
  className,
}: {
  character: Character;
  children?: ReactNode;
  className?: string;
}) => {
  const { accentPrimary, statColorMap } = useContext(ThemeContext);

  const awol =
    (typeof character.stats.injuries === 'number' &&
      character.stats.injuries >= character.stats.permanentInjuries) ||
    false;

  const insane =
    (typeof character.stats.insanities === 'number' &&
      character.stats.insanities >= character.stats.permanentInsanities) ||
    false;

  return (
    <ThemeContainer
      className="relative aspect-square w-full"
      chamfer="medium"
      borderColor={accentPrimary}
      overflowHidden={true}
    >
      <CloudinaryPicture
        className={`${className}`}
        publicId={character?.generatedPicture?.publicId}
      />
      {awol && (
        <InjuryIcon className="absolute left-2 top-4 size-20 fill-black stroke-red-600 stroke-2 p-0.5" />
      )}
      {insane && (
        <InsanityIcon className="absolute left-2 top-4 size-20 fill-black stroke-blue-600 stroke-2 p-0.5" />
      )}
      {awol && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, transparent 40%, ${statColorMap.Health} 100%)`,
          }}
        />
      )}
      {insane && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, transparent 40%, ${statColorMap.Sanity} 100%)`,
          }}
        />
      )}
      {children}
    </ThemeContainer>
  );
};

export default CharacterPicture;
