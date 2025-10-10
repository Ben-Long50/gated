import { useContext, useState } from 'react';
import ReactGridLayout from 'react-grid-layout';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { mdiGrid } from '@mdi/js';
import Icon from '@mdi/react';
import MapGrid from './MapGrid';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { useForm } from '@tanstack/react-form';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';

const Map = ({
  mapId,
  form,
  handleRemove,
}: {
  mapId: number;
  form?: FormApi;
  handleRemove?: (characterId: number, locationId: number) => void;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);

  const [gridDisplay, setGridDisplay] = useState(false);

  const { map, locations, isLoading } = useMap(mapId);

  const mapLayout = map?.layout.map((item) => ({
    ...item,
    isDraggable: false,
    isResizable: false,
    resizeHandles: [],
  }));

  if (isLoading) return <Loading />;

  if (!map) return <h1>No Map Found</h1>;

  return (
    <div className="flex w-full max-w-85dvw flex-col items-center gap-4 sm:gap-8">
      {!mobile && (
        <div className="flex w-full max-w-4xl items-center justify-center gap-8">
          <button
            className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
            aria-label="Open save modal"
            type="button"
            onClick={() => setGridDisplay((prev) => !prev)}
          >
            <Icon
              path={mdiGrid}
              className={`${gridDisplay ? 'text-accent' : 'text-tertiary'} group-hover:text-accent timing size-8`}
            />
          </button>
          <h1 className="text-center">{map.name}</h1>
        </div>
      )}
      <div
        className="scrollbar-primary pointer-events-auto relative max-h-full max-w-full overflow-x-auto overflow-y-auto rounded border-2"
        style={{ borderColor: accentPrimary }}
      >
        <ReactGridLayout
          useCSSTransforms={false}
          className="layout overflow-hidden rounded"
          style={{ width: map.width * 48, height: map.height * 48 }}
          layout={mapLayout}
          cols={map.width}
          rowHeight={48}
          width={map.width * 48}
          margin={[0, 0]}
          allowOverlap={true}
        >
          {mapLayout?.map((item) =>
            item.i === 'base' ? (
              <div
                key={item.i}
                className="-z-10"
                style={{ backgroundColor: map.baseColor }}
              />
            ) : (
              <div
                key={item.i}
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
        <MapGrid
          map={map}
          locations={locations}
          gridDisplay={gridDisplay}
          form={form}
          handleRemove={handleRemove}
        />
      </div>
    </div>
  );
};

export default Map;
