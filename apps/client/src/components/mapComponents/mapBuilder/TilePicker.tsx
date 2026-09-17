import { useEffect, useRef, useState } from 'react';
import getCoords from '../mapUtils/getCoords';
import useMapBuilderStore from 'src/stores/mapBuilderStore';
import { handleTileSelect } from './mapBuilderUtils/handleTileSelect';

const TilePicker = ({
  pngPath,
  gridDisplay,
}: {
  pngPath: string | null;
  gridDisplay: boolean;
}) => {
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });

  const pngRef = useRef<HTMLDivElement | null>(null);

  const tempComponent = useMapBuilderStore((state) => state.tempComponent);
  const setTempComponent = useMapBuilderStore(
    (state) => state.setTempComponent,
  );

  useEffect(() => {
    if (!pngPath) return;

    const div = pngRef.current;
    if (!div) return;

    const img = new Image();
    img.src = `/assets/tiles/${pngPath}`;
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
      className="relative mx-auto grid justify-center"
      style={{
        height: `${grid.rows * 48}px`,
        width: `${grid.cols * 48}px`,
        backgroundImage: `url(/assets/tiles/${pngPath})`,
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
            className={`${gridDisplay && 'ring-1 ring-inset ring-gray-400/50'} ${selected ? 'bg-yellow-300/50 hover:bg-yellow-300/80' : 'hover:bg-gray-400/50'} size-[48px]`}
            style={{ gridRow: row, gridColumn: col }}
            onClick={() => {
              handleTileSelect(
                row,
                col,
                tempComponent,
                setTempComponent,
                `/assets/tiles/${pngPath}`,
              );
            }}
          />
        );
      })}
    </div>
  );
};

export default TilePicker;
