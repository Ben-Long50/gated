import { mdiImage } from '@mdi/js';
import Icon from '@mdi/react';
import CloudinaryPicture from './CloudinaryPicture';
import { ReactNode, useState } from 'react';

export const PictureCard = ({
  label,
  onClick,
  onDoubleClick,
  color,
  publicId,
  className,
  children,
}: {
  label?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  color?: string;
  publicId: string;
  className: string;
  children: ReactNode;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      className={`${className} ${label && 'pb-2'} ${hover ? 'border-accent border-opacity-100' : 'border-transparent border-opacity-50'} bg-primary timing shadow-color group flex w-full flex-col items-center overflow-hidden rounded-md border-2 border-zinc-800`}
      style={{ borderColor: hover ? color : `${color}50` }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {publicId ? (
        <CloudinaryPicture
          className="timing aspect-square w-full origin-bottom group-hover:scale-105"
          publicId={publicId}
          style={{
            maskImage:
              label && 'linear-gradient(to bottom, black 0%, transparent 90%',
          }}
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center">
          <Icon className="text-tertiary opacity-50" path={mdiImage} size={4} />
        </div>
      )}
      {children}
      {label && (
        <p
          style={hover ? { color } : {}}
          className="group-hover:text-accent timing px-2"
        >
          {label}
        </p>
      )}
    </button>
  );
};
