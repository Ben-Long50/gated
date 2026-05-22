import { Layer } from 'src/types/map';
import { mdiLayersOutline, mdiPuzzleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { ReactNode, useState } from 'react';
import useNavigationStore from 'src/stores/navbarStore';
import MapLayerList from './MapLayerList';
import MapComponentList from './MapComponentList';
import { FieldApi } from '@tanstack/react-form';
import InputFieldCheckbox from 'src/components/formFields/InputFieldCheckbox';

const MapBuilderSidebar = ({
  children,
  field,
  layers,
  activeLayerId,
  setActiveLayerId,
  setPreviewLayerId,
  setActiveComponentId,
  quickTilePicker,
  setQuickTilePicker,
  handleAddLayer,
  handleDeleteLayer,
  handleEditLayerName,
  handleHiddenLayer,
  handleEditComponentName,
  handleDeleteComponent,
  handleLayerReorder,
}: {
  children: ReactNode;
  field: FieldApi;
  layers: Layer[];
  activeLayerId: number;
  setActiveLayerId: (id: number) => void;
  setPreviewLayerId: (id: number) => void;
  setActiveComponentId: (id: number | null) => void;
  quickTilePicker: boolean;
  setQuickTilePicker: (mode: boolean) => void;
  handleAddLayer: () => void;
  handleDeleteLayer: (id: number) => void;
  handleEditLayerName: (id: number, newName: string) => void;
  handleHiddenLayer: (id: number) => void;
  handleEditComponentName: (
    layerId: number,
    componentId: number,
    newNamea: string,
  ) => void;
  handleDeleteComponent: (
    e: MouseEvent,
    id: number | undefined,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => void;
  handleLayerReorder: (
    oldIndex: number,
    newIndex: number,
    callback: (layers: Layer[]) => void,
  ) => void;
}) => {
  const [layerSidebar, setLayerSidebar] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'layer' | 'component'>(
    'layer',
  );

  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  return (
    <div
      className={`${layerSidebar ? 'w-96' : 'w-[72px]'} bg-primary scrollbar-primary-2 timing absolute right-0 top-0 z-10 flex h-full flex-col gap-2 overflow-x-hidden p-3 shadow-md shadow-black`}
      onMouseEnter={() => setLayerSidebar(true)}
      onMouseLeave={() => {
        setLayerSidebar(false);
      }}
    >
      {sidebarMode === 'layer' ? (
        <Icon
          path={mdiLayersOutline}
          className="text-primary ml-1 size-10 shrink-0"
        />
      ) : (
        <Icon
          path={mdiPuzzleOutline}
          className="text-primary ml-1 size-10 shrink-0"
        />
      )}

      <div
        className={`${layerSidebar ? 'visible translate-x-0 px-4 opacity-100' : 'invisible translate-x-full opacity-0'} timing bg-primary fixed bottom-0 right-0 z-10 flex w-full max-w-96 flex-col rounded py-4 shadow-lg shadow-black`}
        style={{ top: navbarHeight }}
      >
        {sidebarMode === 'layer' ? (
          <MapLayerList
            field={field}
            layers={layers}
            activeLayerId={activeLayerId}
            setActiveLayerId={setActiveLayerId}
            setPreviewLayerId={setPreviewLayerId}
            setSidebarMode={setSidebarMode}
            handleAddLayer={handleAddLayer}
            handleDeleteLayer={handleDeleteLayer}
            handleEditLayerName={handleEditLayerName}
            handleHiddenLayer={handleHiddenLayer}
            handleLayerReorder={handleLayerReorder}
          />
        ) : (
          <MapComponentList
            layers={layers}
            activeLayerId={activeLayerId}
            setActiveComponentId={setActiveComponentId}
            setSidebarMode={setSidebarMode}
            handleEditComponentName={handleEditComponentName}
            handleDeleteComponent={handleDeleteComponent}
          />
        )}
        <div className="mb-4 flex items-center justify-between">
          <p>Quick Tile Picker</p>
          <InputFieldCheckbox
            label="Quick Tile Picker"
            value={quickTilePicker}
            checked={quickTilePicker}
            onChange={(value) => {
              setQuickTilePicker(!value);
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default MapBuilderSidebar;
