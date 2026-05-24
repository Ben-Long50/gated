import { mdiImage } from '@mdi/js';
import Icon from '@mdi/react';
import CloudinaryPicture from './CloudinaryPicture';
import { CSSProperties, ReactNode } from 'react';

export const PictureCard = ({
  label,
  onClick,
  publicId,
  className,
  style,
  children,
}: {
  label?: string;
  onClick?: () => void;
  publicId: string;
  className: string;
  style: CSSProperties;
  children: ReactNode;
}) => {
  return (
    <button
      className={`${className} ${label && 'pb-2'} bg-primary hover:border-accent timing shadow-color group flex w-full flex-col items-center overflow-hidden rounded-md border-2 border-zinc-800`}
      style={style}
      onClick={onClick}
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
      {label && <p className="group-hover:text-accent timing px-2">{label}</p>}
    </button>
  );
};
