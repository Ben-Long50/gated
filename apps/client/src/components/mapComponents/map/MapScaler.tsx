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
      <h3 className="w-20">{Math.floor(mapScale * 100)}%</h3>
    </div>
  );
};

export default MapScaler;
