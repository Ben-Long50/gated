import { CSSProperties, useContext } from 'react';
import CloudinaryPicture from './CloudinaryPicture';
import { ThemeContext } from 'src/contexts/ThemeContext';

const EntityAvater = ({
  publicId,
  label,
  style,
}: {
  publicId?: string;
  label: string;
  style?: CSSProperties;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <div className="pointer-events-none relative">
      <div
        className={`shadow-color relative aspect-square size-12 shrink-0 overflow-hidden rounded-full shadow-md`}
        style={style}
      >
        {publicId ? (
          <CloudinaryPicture publicId={publicId} />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center`}
            style={{ backgroundColor: accentPrimary }}
          >
            <h2 className="size-10 select-none pl-0.5 pt-1 text-center !text-zinc-950">
              {label?.charAt(0).toUpperCase()}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityAvater;
