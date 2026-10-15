import CloudinaryPicture from './CloudinaryPicture';
import { ReactHTMLElement, ReactNode, useState } from 'react';

export const PictureCard = ({
  label,
  onClick,
  onDoubleClick,
  color,
  publicId,
  className,
  children,
}: {
  label?: ReactNode;
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
      className={`${className} ${hover ? 'border-accent border-opacity-100' : 'border-transparent border-opacity-50'} bg-primary timing shadow-color group relative max-w-[300px] overflow-hidden rounded-md border-2 border-zinc-800`}
      style={{ borderColor: hover ? color : `${color}50` }}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault();
              onClick();
            }
          : (e) => {
              e.preventDefault();
            }
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
          className="group-hover:text-accent timing absolute bottom-0 left-0 right-0 px-2 pb-1"
        >
          {label}
        </p>
      )}
    </button>
  );
};
