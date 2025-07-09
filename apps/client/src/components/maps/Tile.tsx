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
  tileSize,
  tileUrl,
  resizeMode,
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
  tileSize: number;
  tileUrl: string;
  resizeMode: 'extending' | 'repeating';
}) => {
  const backgroundSize = (() => {
    if (resizeMode === 'extending') {
      return `${tileSize * tileWidth}px ${tileSize * tileHeight}px`;
    } else if (resizeMode === 'repeating') {
      return `${tileSize}px`;
    }
    return undefined;
  })();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        backgroundPosition: '0 0',
        imageRendering: 'pixelated',
        backgroundSize: backgroundSize,
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
