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
import Sidebar from 'src/components/sidebars/Sidebar';

const MapBuilderSidebar = ({ form }: { form: FormApi }) => {
  const [layerSidebar, setLayerSidebar] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<'layer' | 'component'>(
    'layer',
  );

  const activeLayerId = useMapBuilderStore((state) => state.activeLayerId);

  return (
    <Sidebar position="right" open={layerSidebar} setOpen={setLayerSidebar}>
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
        className={`${layerSidebar ? 'visible opacity-100' : 'invisible max-w-0 opacity-0'} timing mb-11 flex h-full w-full max-w-[400px] flex-col gap-4`}
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
    </Sidebar>
  );
};

export default MapBuilderSidebar;
