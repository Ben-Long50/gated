import { Layer } from 'src/types/map';
import BtnIcon from '../buttons/BtnIcon';
import {
  mdiDrag,
  mdiEye,
  mdiLayers,
  mdiLayersRemove,
  mdiTrashCanOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import ArrowHeader3 from '../ArrowHeader3';
import Divider from '../Divider';
import { capitalCase } from 'change-case';

const MapLayerList = ({ layers }: { layers: Layer[] }) => {
  const [layerMode, setLayerMode] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ i: string; index: number } | null>(
    null,
  );
  const [dragover, setDragover] = useState<{ i: string; index: number } | null>(
    null,
  );

  return (
    <>
      <button
        className={`${layerMode ? 'invisible translate-x-full opacity-0' : 'visible translate-x-0 opacity-100'} timing bg-tertiary group fixed right-4 top-[72px] mb-auto flex rounded p-1.5 shadow-md shadow-black`}
        aria-label="Open save modal"
        type="button"
        onClick={() => {
          setLayerMode(true);
        }}
      >
        <Icon
          path={mdiLayers}
          className="text-tertiary group-hover:text-accent timing size-8"
        />
      </button>

      <div
        className={`${layerMode ? 'visible translate-x-0 px-4 opacity-100' : 'invisible translate-x-full opacity-0'} timing bg-primary fixed bottom-0 right-0 top-[56px] flex w-80 flex-col rounded py-4 shadow-lg shadow-black`}
      >
        <div className="flex items-center justify-between">
          <ArrowHeader3 className="whitespace-nowrap" title="Map Layers" />
          <button
            className={`bg-tertiary group flex rounded p-1.5 shadow-md shadow-black`}
            aria-label="Open save modal"
            type="button"
            onClick={() => {
              setLayerMode(false);
            }}
          >
            <Icon
              path={mdiLayersRemove}
              className="text-tertiary group-hover:text-accent timing size-8"
            />
          </button>
        </div>
        <Divider />
        <div className="scrollbar-primary-2 flex flex-col overflow-y-auto pb-2">
          {layers?.map((layer, index) => (
            <div
              className="w-full"
              onDragEnd={() => {
                setDragging(null);
                setDragover(null);
              }}
              onDragStart={() => setDragging({ i: layer.i, index })}
              onDragOver={(e) => {
                e.preventDefault();
                setDragover({ i: layer.i, index });
              }}
              // onDrop={() => handleLayerReorder(layout)}
            >
              {dragging &&
                dragover &&
                dragging?.index > dragover?.index &&
                dragover?.i === layer.i && (
                  <hr className={'border-accent border-2'} />
                )}
              <div
                className={`timing text-secondary hover:bg-secondary timing hover:!text-accent layers-center flex cursor-grab select-none gap-2 rounded p-2 hover:shadow-md hover:shadow-black`}
                onMouseEnter={() => setHoveredKey(layer.i)}
                onMouseLeave={() => setHoveredKey(null)}
                draggable={true}
              >
                <Icon path={mdiDrag} className="size-7" />
                <h4 className="grow whitespace-nowrap !text-inherit">
                  {capitalCase(layer.name)}
                </h4>
                <BtnIcon
                  path={mdiEye}
                  active={true}
                  // onClick={() => handleTileDelete(layout, layer)}
                />
                <BtnIcon
                  path={mdiTrashCanOutline}
                  active={true}
                  // onClick={() => handleTileDelete(layout, layer)}
                />
              </div>
              {dragging &&
                dragover &&
                dragging?.index < dragover?.index &&
                dragover?.i === layer.i && (
                  <hr className={'border-accent border-2'} />
                )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MapLayerList;
