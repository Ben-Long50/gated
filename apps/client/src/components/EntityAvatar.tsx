import { CSSProperties, useContext } from 'react';
import CloudinaryPicture from './CloudinaryPicture';
import { ThemeContext } from 'src/contexts/ThemeContext';
import constructName from 'src/utils/constructName';
import { Gang } from 'src/types/gang';
import { Faction } from 'src/types/faction';
import { Character } from 'src/types/character';
import { Campaign, Session } from 'src/types/campaign';

const EntityAvater = ({
  entity,
  className,
  style,
}: {
  entity: Campaign | Session | Faction | Gang | Character;
  className?: string;
  style?: CSSProperties;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const name = constructName(entity);

  return (
    <div className="pointer-events-none relative">
      <div
        className={`${className} shadow-color relative aspect-square size-12 shrink-0 overflow-hidden rounded-full shadow-md`}
        style={style}
      >
        {entity?.picture?.publicId ? (
          <CloudinaryPicture
            publicId={entity?.picture?.publicId}
            position={entity?.picture?.position}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center`}
            style={{ backgroundColor: accentPrimary }}
          >
            <h2 className="size-10 select-none pl-0.5 pt-1 text-center !text-zinc-950">
              {name?.charAt(0)}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityAvater;
