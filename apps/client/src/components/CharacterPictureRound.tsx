import { useContext } from 'react';
import CloudinaryImage from './CloudinaryImage';
import { Character } from 'src/types/character';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InjuryIcon from './icons/InjuryIcon';

const CharacterPictureRound = ({
  character,
  className,
}: {
  character: Character;
  className?: string;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const name = character?.firstName || character?.name;

  const awol =
    (typeof character?.stats?.injuries === 'number' &&
      character?.stats?.injuries >= character.stats?.permanentInjuries) ||
    false;

  return (
    <div
      className={`${className} shadow-color relative aspect-square size-12 shrink-0 overflow-hidden rounded-full shadow-md`}
    >
      {character?.picture?.imageUrl ? (
        <CloudinaryImage
          className={`${awol && 'grayscale'} `}
          publicId={character?.picture?.publicId}
          position={character?.picture?.position}
        />
      ) : (
        <div
          className={`${awol && 'grayscale'} flex h-full w-full items-center justify-center`}
          style={{ backgroundColor: accentPrimary }}
        >
          <h2 className="size-10 select-none pl-0.5 pt-1 text-center !text-zinc-950">
            {name?.charAt(0)}
          </h2>
        </div>
      )}
      {awol && (
        <InjuryIcon className="absolute inset-0 size-full fill-black stroke-red-600 stroke-2 p-0.5" />
      )}
    </div>
  );
};

export default CharacterPictureRound;
