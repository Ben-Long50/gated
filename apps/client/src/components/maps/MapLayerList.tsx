import { Layer } from 'src/types/map';
import BtnIcon from '../buttons/BtnIcon';
import {
  mdiCheckOutline,
  mdiDrag,
  mdiEye,
  mdiEyeClosed,
  mdiLayers,
  mdiLayersRemove,
  mdiNoteEditOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import ArrowHeader3 from '../ArrowHeader3';
import Divider from '../Divider';
import { capitalCase } from 'change-case';
import BtnRect from '../buttons/BtnRect';
import InputFieldBasic from '../InputFieldBasic';
import useNavigationStore from 'src/stores/navbarStore';

const MapLayerList = ({
  layers,
  activeLayerId,
  setActiveLayerId,
  handleAddLayer,
  handleDeleteLayer,
  handleEditLayerName,
  handleHiddenLayer,
}: {
  layers: Layer[];
  activeLayerId: number;
  setActiveLayerId: (id: number) => void;
  handleAddLayer: () => void;
  handleDeleteLayer: (id: number) => void;
  handleEditLayerName: (id: number, newName: string) => void;
  handleHiddenLayer: (id: number) => void;
}) => {
  const [layerMode, setLayerMode] = useState(false);
  const [editName, setEditName] = useState<string | null>(null);
  const [newLayerName, setNewLayerName] = useState<string | null>(null);

  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  return (
    <>
      <button
        className={`${layerMode ? 'invisible translate-x-full opacity-0' : 'visible translate-x-0 opacity-100'} timing bg-tertiary group fixed right-4 mb-auto flex rounded p-1.5 shadow-md shadow-black`}
        style={{ top: navbarHeight + 16 }}
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
        className={`${layerMode ? 'visible translate-x-0 px-4 opacity-100' : 'invisible translate-x-full opacity-0'} timing bg-primary fixed bottom-0 right-0 z-10 flex w-full max-w-96 flex-col rounded py-4 shadow-lg shadow-black`}
        style={{ top: navbarHeight }}
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
        <div className="flex w-full flex-col gap-4">
          <BtnRect type="button" ariaLabel="Add layer" onClick={handleAddLayer}>
            Add Layer
          </BtnRect>
          <div className="scrollbar-primary-2 flex flex-col overflow-y-auto pb-2">
            {layers?.map((layer, index) => {
              const active = layer.id === activeLayerId;

              return (
                <div
                  key={index}
                  className={`${active && 'ring-2 ring-inset ring-[var(--accent-primary)]'} timing w-full rounded-md`}
                  onClick={() => setActiveLayerId(layer.id)}
                >
                  <div
                    className={`timing text-secondary timing hover:!text-accent layers-center flex cursor-grab select-none items-center gap-2 rounded p-2 pl-1`}
                    draggable={true}
                  >
                    {editName !== layer.name && (
                      <Icon path={mdiDrag} className="size-7" />
                    )}
                    {editName === layer.name ? (
                      <InputFieldBasic
                        label="Layer Name"
                        type="string"
                        value={layer.name}
                        onChange={(value) => setNewLayerName(value)}
                      />
                    ) : (
                      <h4 className={`grow whitespace-nowrap !text-inherit`}>
                        {capitalCase(layer.name)}
                      </h4>
                    )}
                    {editName !== layer.name && (
                      <BtnIcon
                        path={layer.hidden ? mdiEyeClosed : mdiEye}
                        active={true}
                        onClick={() => handleHiddenLayer(layer.id)}
                      />
                    )}
                    {editName === layer.name ? (
                      <BtnIcon
                        path={mdiCheckOutline}
                        active={true}
                        onClick={() => {
                          if (typeof newLayerName === 'string') {
                            handleEditLayerName(layer.id, newLayerName);
                          }
                          setNewLayerName(null);
                          setEditName(null);
                        }}
                      />
                    ) : (
                      <BtnIcon
                        path={mdiNoteEditOutline}
                        active={true}
                        onClick={() => setEditName(layer.name)}
                      />
                    )}
                    {editName !== layer.name && (
                      <BtnIcon
                        path={mdiTrashCanOutline}
                        active={true}
                        onClick={() => handleDeleteLayer(layer.id)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MapLayerList;
