import { useEffect, useRef, useState } from 'react';
import { Component } from 'src/types/map';
import getCoords from '../mapUtils/getCoords';

const TilePicker = ({
  pngPath,
  tempComponent,
  handleTileSelect,
}: {
  pngPath: string | null;
  tempComponent: Component | null;
  handleTileSelect: (row: number, col: number) => void;
}) => {
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });

  const pngRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pngPath) return;

    const div = pngRef.current;
    if (!div) return;

    const img = new Image();
    img.src = pngPath;
    img.onload = () => {
      const naturalW = img.width;
      const naturalH = img.height;

      setGrid({
        rows: Math.ceil(naturalH / 48),
        cols: Math.ceil(naturalW / 48),
      });
    };
  }, [pngPath]);

  return (
    <div
      ref={pngRef}
      className="relative grid justify-center"
      style={{
        height: `${grid.rows * 48}px`,
        width: `${grid.cols * 48}px`,
        backgroundImage: `url(${pngPath})`,
        backgroundSize: 'cover',
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
      }}
    >
      {Array.from({ length: grid.rows * grid.cols }).map((_, index) => {
        const { row, col } = getCoords(grid.cols, index);

        const inCol =
          tempComponent !== null && tempComponent.imageColStart !== undefined
            ? col >= tempComponent.imageColStart &&
              col < tempComponent.width + tempComponent.imageColStart
            : false;

        const inRow =
          tempComponent !== null && tempComponent.imageRowStart !== undefined
            ? row >= tempComponent.imageRowStart &&
              row < tempComponent.height + tempComponent.imageRowStart
            : false;

        const selected = inCol && inRow;

        return (
          <div
            key={index}
            className={`${selected ? 'bg-yellow-300/50 hover:bg-yellow-300/80' : 'hover:bg-gray-400/50'} size-full ring-1 ring-inset ring-gray-400/50`}
            style={{ gridRow: row, gridColumn: col }}
            onClick={() => {
              handleTileSelect(row, col);
            }}
          />
        );
      })}
    </div>
  );
};

export default TilePicker;
