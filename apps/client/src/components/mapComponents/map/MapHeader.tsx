import Icon from '@mdi/react';
import MapScaler from './MapScaler';
import { mdiCancel, mdiGrid } from '@mdi/js';
import SizeIcon from 'src/components/icons/SizeIcon';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { EncounterContext } from 'src/contexts/EncounterContext';

const MapHeader = ({
  mapName,
  gridDisplay,
  setGridDisplay,
  measureMode,
  setMeasureMode,
  mapScale,
  setMapScale,
}: {
  mapName: string;
  gridDisplay: boolean;
  setGridDisplay: (prev: (prev: boolean) => boolean) => void;
  measureMode: boolean;
  setMeasureMode: (prev: (prev: boolean) => boolean) => void;
  mapScale: number;
  setMapScale: (prev: (prev: number) => number) => void;
}) => {
  const { user } = useContext(AuthContext);
  const { targetMap, removeTarget } = useContext(EncounterContext);

  const measuring = targetMap.get(`user ${user.id}`);

  return (
    <div className="flex w-full items-center justify-center gap-8">
      <h1 className="text-center">{mapName}</h1>
      <div className="flex items-center justify-start gap-4">
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
        <button
          className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
          aria-label="Open save modal"
          type="button"
          onClick={() => setMeasureMode((prev) => !prev)}
        >
          <SizeIcon
            className={`${measureMode ? 'text-accent' : 'text-tertiary'} group-hover:text-accent timing size-8`}
          />
        </button>
        {measuring && (
          <button
            className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
            aria-label="Open save modal"
            type="button"
            onClick={() => removeTarget(`user ${user.id}`)}
          >
            <Icon
              path={mdiCancel}
              className={`group-hover:text-accent text-tertiary timing size-8`}
            />
          </button>
        )}
        <MapScaler mapScale={mapScale} setMapScale={setMapScale} />
      </div>
    </div>
  );
};

export default MapHeader;
