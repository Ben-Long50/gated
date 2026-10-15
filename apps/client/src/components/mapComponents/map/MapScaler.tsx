import { mdiMagnifyMinusOutline, mdiMagnifyPlusOutline } from '@mdi/js';
import Icon from '@mdi/react';
import IconBtnMedium from 'src/components/buttons/IconBtnMedium';

const MapScaler = ({
  mapScale,
  setMapScale,
}: {
  mapScale: number;
  setMapScale: (scale: (prev: number) => number) => void;
}) => {
  return (
    <div className="flex items-center gap-4">
      <IconBtnMedium
        tooltip="Zoom Out Map"
        onClick={() =>
          setMapScale((prev: number) => {
            if (prev > 0.2) {
              return prev - 0.1;
            } else {
              return prev;
            }
          })
        }
      >
        <Icon path={mdiMagnifyMinusOutline} />
      </IconBtnMedium>
      <IconBtnMedium
        tooltip="Zoom In Map"
        onClick={() =>
          setMapScale((prev: number) => {
            if (prev < 2) {
              return prev + 0.1;
            } else {
              return prev;
            }
          })
        }
      >
        <Icon path={mdiMagnifyPlusOutline} />
      </IconBtnMedium>
      <p>{Math.floor(mapScale * 100)}%</p>
    </div>
  );
};

export default MapScaler;
