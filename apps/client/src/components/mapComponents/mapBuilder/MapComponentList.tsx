import { Component, Layer } from 'src/types/map';
import {
  mdiCheckOutline,
  mdiNoteEditOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { capitalCase } from 'change-case';
import InputField from '../../formFields/InputField';
import { FormApi } from '@tanstack/react-form';
import BtnAuth from 'src/components/buttons/BtnAuth';
import useMapBuilderStore from 'src/stores/mapBuilderStore';
import { handleEditComponentName } from './mapBuilderUtils/handleEditComponentName';
import { handleDeleteComponent } from './mapBuilderUtils/handleDeleteComponent';
import IconBtnSmall from 'src/components/buttons/IconBtnSmall';

const MapComponentList = ({
  form,
  setSidebarMode,
}: {
  form: FormApi;
  setSidebarMode: (mode: 'layer' | 'component') => void;
}) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [newComponentName, setNewComponentName] = useState<string>('');

  const activeLayerId = useMapBuilderStore((state) => state.activeLayerId);
  const setActiveComponentId = useMapBuilderStore(
    (state) => state.setActiveComponentId,
  );

  return (
    <>
      <BtnAuth onClick={() => setSidebarMode('layer')}>Back</BtnAuth>
      <form.Field name="layers">
        {(field) => {
          const activeLayer = field.state.value.find(
            (layer: Layer) => layer.id === activeLayerId,
          );

          return (
            <div className="scrollbar-primary-2 my-4 flex h-full flex-col gap-3 overflow-y-auto pb-2">
              {activeLayer?.components.map(
                (component: Component, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`timing text-secondary timing layers-center group flex cursor-pointer select-none items-center gap-2`}
                      onMouseEnter={() => setActiveComponentId(component.id)}
                      onMouseLeave={() => setActiveComponentId(null)}
                    >
                      {editId === component.id ? (
                        <>
                          <InputField
                            label="Component Name"
                            value={component.name || newComponentName}
                            onChange={(value) => setNewComponentName(value)}
                          />
                          <IconBtnSmall
                            tooltip="Confirm"
                            onClick={() => {
                              if (typeof newComponentName === 'string') {
                                handleEditComponentName(
                                  form,
                                  activeLayerId,
                                  component.id,
                                  newComponentName,
                                );
                              }
                              setNewComponentName(null);
                              setEditId(null);
                            }}
                          >
                            <Icon path={mdiCheckOutline} />
                          </IconBtnSmall>
                        </>
                      ) : (
                        <>
                          <p
                            className={`group-hover:text-accent timing grow whitespace-nowrap`}
                          >
                            {capitalCase(component.name)}
                          </p>
                          <IconBtnSmall
                            tooltip="Edit Name"
                            onClick={() => setEditId(component.id)}
                          >
                            <Icon path={mdiNoteEditOutline} />
                          </IconBtnSmall>
                          <IconBtnSmall
                            tooltip="Delete"
                            onClick={() =>
                              handleDeleteComponent(
                                undefined,
                                activeLayerId,
                                component.id,
                                field.state.value,
                                field.handleChange,
                              )
                            }
                          >
                            <Icon path={mdiTrashCanOutline} />
                          </IconBtnSmall>
                        </>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          );
        }}
      </form.Field>
    </>
  );
};

export default MapComponentList;
