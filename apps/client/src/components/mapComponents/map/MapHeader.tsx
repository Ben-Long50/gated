import Icon from '@mdi/react';
import MapScaler from './MapScaler';
import { mdiGrid } from '@mdi/js';

const MapHeader = ({
  mapName,
  gridDisplay,
  setGridDisplay,
  mapScale,
  setMapScale,
}: {
  mapName: string;
  gridDisplay: boolean;
  setGridDisplay: (prev: (prev: boolean) => boolean) => void;
  mapScale: number;
  setMapScale: (prev: (prev: number) => number) => void;
}) => {
  return (
    <div className="flex w-full max-w-5xl items-center justify-between gap-8">
      <div className="flex items-center justify-start gap-8">
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
        <h1 className="text-center">{mapName}</h1>
      </div>
      <MapScaler mapScale={mapScale} setMapScale={setMapScale} />
    </div>
  );
};

export default MapHeader;
