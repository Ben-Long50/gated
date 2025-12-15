import { mdiMagnifyMinusOutline, mdiMagnifyPlusOutline } from '@mdi/js';
import Icon from '@mdi/react';

const MapScaler = ({
  mapScale,
  setMapScale,
}: {
  mapScale: number;
  setMapScale: (scale: (prev: number) => number) => void;
}) => {
  return (
    <div className="flex items-center gap-4">
      <button
        className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
        aria-label="Open save modal"
        type="button"
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
        <Icon
          path={mdiMagnifyMinusOutline}
          className={`text-tertiary group-hover:text-accent timing size-8`}
        />
      </button>
      <h3>{Math.floor(mapScale * 100)}%</h3>
      <button
        className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
        aria-label="Open save modal"
        type="button"
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
        <Icon
          path={mdiMagnifyPlusOutline}
          className={`text-tertiary group-hover:text-accent timing size-8`}
        />
      </button>
    </div>
  );
};

export default MapScaler;
