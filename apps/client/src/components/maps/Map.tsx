import { useContext, useLayoutEffect, useRef, useState } from 'react';
import ReactGridLayout from 'react-grid-layout';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import Tile from './Tile';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { mdiGrid } from '@mdi/js';
import Icon from '@mdi/react';
import RangeIcon from '../icons/RangeIcon';
import InputFieldBasic from '../InputFieldBasic';
import ThemeContainer from '../ThemeContainer';

const Map = () => {
  const { accentPrimary, errorPrimary } = useContext(ThemeContext);
  const [gridDisplay, setGridDisplay] = useState(false);
  const [rangeMode, setRangeMode] = useState(false);
  const [range, setRange] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [widthModifier, setWidthModifier] = useState(500);
  const containerRef = useRef(null);

  const { map, isLoading } = useMap();

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setWidthModifier(width);
    }
  }, [containerRef.current]);

  const mapLayout = map?.layout.map((item) => ({
    ...item,
    isDraggable: false,
    isResizable: false,
    resizeHandles: [],
  }));

  const getCoordinates = (index: number) => {
    return {
      x:
        map.width -
          (map.width - Math.ceil((index + 1 + map.width) % map.width)) ||
        map.width,
      y: Math.ceil(index / map.width),
    };
  };

  const isInRange = (
    currentCoordinates: { x: number; y: number },
    mapCoordinates: { x: number; y: number },
    range: number,
  ) => {
    const dx = mapCoordinates.x - currentCoordinates.x;
    const dy = mapCoordinates.y - currentCoordinates.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= range;
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex h-full w-full max-w-8xl flex-col items-center gap-4 sm:gap-8">
      <h1>{map.name}</h1>
      <div
        className="scrollbar-primary relative max-w-full overflow-x-auto overflow-y-auto rounded border-2"
        style={{
          borderColor: accentPrimary,
        }}
      >
        <ReactGridLayout
          className="layout overflow-hidden rounded"
          style={{ width: map.width * 48, height: map.height * 48 }}
          layout={mapLayout}
          cols={map.width}
          rowHeight={48}
          width={map.width * 48}
          margin={[0, 0]}
          allowOverlap={true}
        >
          {mapLayout.map((item) =>
            item.i === 'base' ? (
              <div
                key={item.i}
                className={`${item.className} -z-10`}
                style={{
                  backgroundColor: map.baseColor,
                }}
              />
            ) : (
              <div
                key={item.i}
                className={item.className}
                style={{
                  backgroundPosition: '0 0',
                  imageRendering: 'pixelated',
                  backgroundSize: `${48 * item.tileWidth}px ${48 * item.tileHeight}px`,
                  backgroundImage: `url(${item.tileUrl})`,
                }}
              />
            ),
          )}
        </ReactGridLayout>
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${map.width}, 48px)`,
            gridTemplateRows: `repeat(${map.height}, 48px)`,
          }}
        >
          {Array.from({ length: map.width * map.height }).map((_, index) => {
            const mapCoordinates = getCoordinates(index);

            const currentCoordinates = getCoordinates(hoveredIndex);

            const inRange = rangeMode
              ? isInRange(currentCoordinates, mapCoordinates, range)
              : null;

            return (
              <div
                key={index}
                className={`${gridDisplay && 'border-accent border'} relative size-12 opacity-50`}
                style={{
                  borderColor: accentPrimary,
                  transition: 'background ease .2s',
                  background: inRange
                    ? `radial-gradient(circle, transparent, 50%, ${errorPrimary})`
                    : hoveredIndex === index
                      ? `radial-gradient(circle, transparent, 65%, ${accentPrimary})`
                      : 'transparent',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {hoveredIndex === index && (
                  <p
                    className="bg-tertiary absolute right-1/2 top-0 whitespace-nowrap rounded p-1 py-0.5 text-sm"
                    style={{
                      transform:
                        'translateY(-100%) translateY(-4px) translateX(50%)',
                    }}
                  >
                    [{mapCoordinates.x}, {mapCoordinates.y}]
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <ThemeContainer
        className="!sticky bottom-[33px] mt-auto"
        borderColor={accentPrimary}
        chamfer="small"
      >
        <div className="flex items-center justify-start gap-4 p-4">
          <button
            className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
            aria-label="Open save modal"
            type="button"
            onClick={() => setGridDisplay((prev) => !prev)}
          >
            <Icon
              path={mdiGrid}
              className="text-tertiary group-hover:text-accent timing size-8"
            />
          </button>
          <button
            className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
            aria-label="Open save modal"
            type="button"
            onClick={() => setRangeMode((prev) => !prev)}
          >
            <RangeIcon className="text-tertiary group-hover:text-accent timing size-8" />
          </button>
          <InputFieldBasic
            type="number"
            label="Range"
            value={range}
            onChange={(range) => setRange(Number(range))}
          />
        </div>
      </ThemeContainer>
    </div>
  );
};

export default Map;
