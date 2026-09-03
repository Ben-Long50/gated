import Icon from '@mdi/react';
import MapScaler from './MapScaler';
import { mdiCancel, mdiGrid } from '@mdi/js';
import SizeIcon from 'src/components/icons/SizeIcon';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { EncounterContext } from 'src/contexts/EncounterContext';
import IconBtnMedium from 'src/components/buttons/IconBtnMedium';

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

  const measuring = targetMap ? targetMap.get(`user ${user.id}`) : null;

  return (
    <div className="flex w-full items-center justify-center gap-8">
      <h1 className="text-center">{mapName}</h1>
      <div className="flex items-center justify-start gap-4">
        <IconBtnMedium
          onClick={() => setGridDisplay((prev) => !prev)}
          active={gridDisplay}
          tooltip={gridDisplay ? 'Hide Grid' : 'Show Grid'}
        >
          <Icon path={mdiGrid} />
        </IconBtnMedium>
        <IconBtnMedium
          onClick={() => setMeasureMode((prev) => !prev)}
          active={measureMode}
          tooltip={measureMode ? 'Enable Measure Mode' : 'Disable Measure Mode'}
        >
          <SizeIcon />
        </IconBtnMedium>
        {measuring && (
          <IconBtnMedium
            onClick={() => removeTarget(`user ${user.id}`)}
            tooltip="Remove Measurement"
          >
            <Icon path={mdiCancel} />
          </IconBtnMedium>
        )}
        <MapScaler mapScale={mapScale} setMapScale={setMapScale} />
      </div>
    </div>
  );
};

export default MapHeader;
