import { CSSProperties, useContext } from 'react';
import CloudinaryPicture from '../CloudinaryPicture';
import { Character } from 'src/types/character';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Icon from '@mdi/react';
import {
  mdiAlphaGCircleOutline,
  mdiAlphaMCircleOutline,
  mdiAlphaSCircleOutline,
  mdiAlphaTCircleOutline,
} from '@mdi/js';

const CharacterPictureRound = ({
  character,
  className,
  style,
}: {
  character: Character;
  className?: string;
  style?: CSSProperties;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const awol =
    (typeof character?.stats?.injuries === 'number' &&
      character?.stats?.injuries >= character.stats?.permanentInjuries) ||
    false;

  const insane =
    (typeof character?.stats?.insanities === 'number' &&
      character?.stats?.insanities >= character.stats?.permanentInsanities) ||
    false;

  return (
    <div className="pointer-events-none relative">
      <div
        className={`${className} shadow-color relative aspect-square size-12 shrink-0 overflow-hidden rounded-full shadow-md`}
        style={style}
      >
        {character?.generatedPicture?.publicId ? (
          <CloudinaryPicture
            className={`${(awol || insane) && 'grayscale'}`}
            publicId={character?.generatedPicture?.publicId}
          />
        ) : (
          <div
            className={`${awol && 'grayscale'} flex h-full w-full items-center justify-center`}
            style={{ backgroundColor: accentPrimary }}
          >
            <h2 className="size-10 select-none pl-0.5 pt-1 text-center !text-zinc-950">
              {character?.name.charAt(0)}
            </h2>
          </div>
        )}
        <div
          className={`${awol && !insane && 'bg-red-600'} ${insane && !awol && 'bg-blue-600'} ${awol && insane && 'bg-purple-600'} absolute inset-0 bg-opacity-35`}
        />
      </div>
      {character?.npcTypes && character?.npcTypes.length > 0 && (
        <div className="absolute -right-1 -top-1 flex flex-wrap items-center">
          {character?.npcTypes.includes('shop') && (
            <Icon
              className="text-primary"
              path={mdiAlphaSCircleOutline}
              size={0.8}
            />
          )}
          {character?.npcTypes.includes('monster') && (
            <Icon
              className="text-primary"
              path={mdiAlphaMCircleOutline}
              size={0.8}
            />
          )}
          {character?.npcTypes.includes('goon') && (
            <Icon
              className="text-primary"
              path={mdiAlphaGCircleOutline}
              size={0.8}
            />
          )}
          {character?.npcTypes.includes('template') && (
            <Icon
              className="text-primary"
              path={mdiAlphaTCircleOutline}
              size={0.8}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterPictureRound;
