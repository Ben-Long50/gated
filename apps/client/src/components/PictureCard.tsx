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
  publicId?: string;
  className?: string;
  children?: ReactNode;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      className={`${className} ${label && 'pb-2'} ${hover ? 'border-accent border-opacity-100' : 'border-transparent border-opacity-50'} bg-primary timing shadow-color group flex w-full max-w-[300px] flex-col items-center overflow-hidden rounded-md border-2 border-zinc-800`}
      style={{ borderColor: hover ? color : `${color}50` }}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault();
              onClick();
            }
          : undefined
      }
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CloudinaryPicture
        className="timing aspect-square w-full origin-bottom group-hover:scale-105"
        publicId={publicId}
        style={{
          maskImage:
            label && 'linear-gradient(to bottom, black 0%, transparent 90%',
        }}
      />
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
