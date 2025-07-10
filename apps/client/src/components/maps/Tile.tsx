import { CSSProperties, ReactNode, Ref } from 'react';

const Tile = ({
  ref,
  style,
  className,
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  onDoubleClick,
  children,
  tileWidth,
  tileHeight,
  tileUrl,
}: {
  ref?: Ref<HTMLDivElement>;
  style: CSSProperties;
  className: string;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onTouchEnd?: () => void;
  onDoubleClick?: () => void;
  children?: ReactNode;
  tileWidth: number;
  tileHeight: number;
  tileUrl?: string;
}) => {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        backgroundPosition: '0 0',
        imageRendering: 'pixelated',
        backgroundSize: `${48 * tileWidth}px ${48 * tileHeight}px`,
        backgroundImage: `url(${tileUrl})`,
        ...style,
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
};

export default Tile;
