import { CSSProperties, useContext } from 'react';
import CloudinaryImage from './CloudinaryImage';
import { Character } from 'src/types/character';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InjuryIcon from './icons/InjuryIcon';
import InsanityIcon from './icons/InsanityIcon';

const CharacterPictureRound = ({
  character,
  className,
  style,
}: {
  character: Character;
  className?: string;
  style: CSSProperties;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const name = character?.firstName || character?.name;

  const awol =
    (typeof character?.stats?.injuries === 'number' &&
      character?.stats?.injuries >= character.stats?.permanentInjuries) ||
    false;

  const insane =
    (typeof character?.stats?.insanities === 'number' &&
      character?.stats?.insanities >= character.stats?.permanentInsanities) ||
    false;

  return (
    <div
      className={`${className} shadow-color relative aspect-square size-12 shrink-0 overflow-hidden rounded-full shadow-md`}
      style={style}
    >
      {character?.picture?.imageUrl ? (
        <CloudinaryImage
          className={`${(awol || insane) && 'grayscale'} `}
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
      {insane && (
        <InsanityIcon className="absolute inset-0 size-full fill-black stroke-blue-600 stroke-2 p-0.5" />
      )}
    </div>
  );
};

export default CharacterPictureRound;
