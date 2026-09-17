import { Component, Layer } from 'src/types/map';
import { mdiLayersOutline, mdiPuzzleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import MapLayerList from './MapLayerList';
import MapComponentList from './MapComponentList';
import { FormApi } from '@tanstack/react-form';
import ArrowHeader3 from 'src/components/ArrowHeader3';
import InputField from 'src/components/formFields/InputField';
import useMapBuilderStore from 'src/stores/mapBuilderStore';

const MapBuilderSidebar = ({ form }: { form: FormApi }) => {
  const [layerSidebar, setLayerSidebar] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<'layer' | 'component'>(
    'layer',
  );

  const activeLayerId = useMapBuilderStore((state) => state.activeLayerId);

  return (
    <div
      className={`${layerSidebar ? 'w-96' : 'w-[72px]'} scrollbar-primary-2 timing bg-base shadow-color fixed bottom-0 right-0 top-0 z-20 my-4 mr-2 grid grid-rows-[auto,1fr] gap-4 overflow-x-hidden rounded-md p-3 shadow-md`}
      onMouseEnter={() => setLayerSidebar(true)}
      onMouseLeave={() => {
        setLayerSidebar(false);
      }}
    >
      <form.Subscribe selector={(state) => state.values.layers}>
        {(layers: Layer[]) => {
          const activeLayer = layers.find(
            (layer) => layer.id === activeLayerId,
          );

          return (
            <div className="flex items-center justify-start gap-4">
              <Icon
                path={
                  sidebarMode === 'layer' ? mdiLayersOutline : mdiPuzzleOutline
                }
                className="text-primary ml-1 size-10 shrink-0"
              />
              <ArrowHeader3
                className={`${layerSidebar ? 'opacity-100' : 'opacity-0'} timing truncate`}
                title={
                  sidebarMode === 'layer'
                    ? 'Layers'
                    : `${activeLayer?.name} Components`
                }
              />
            </div>
          );
        }}
      </form.Subscribe>

      <div
        className={`${layerSidebar ? 'visible opacity-100' : 'invisible max-w-0 opacity-0'} timing flex h-full w-full max-w-[400px] flex-col gap-4`}
      >
        {sidebarMode === 'layer' ? (
          <MapLayerList form={form} setSidebarMode={setSidebarMode} />
        ) : (
          <MapComponentList form={form} setSidebarMode={setSidebarMode} />
        )}
        <form.Field name="width">
          {(field) => (
            <InputField
              type="number"
              label="Map Width"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </form.Field>
        <form.Field name="height">
          {(field) => (
            <InputField
              type="number"
              label="Map Height"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
};

export default MapBuilderSidebar;
