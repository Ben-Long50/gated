import { Layer } from 'src/types/map';
import {
  mdiCheckOutline,
  mdiNoteEditOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { capitalCase } from 'change-case';
import InputField from '../../formFields/InputField';
import BtnRect from '../../buttons/BtnRect';
import { FormApi } from '@tanstack/react-form';
import BtnAuth from 'src/components/buttons/BtnAuth';

const MapComponentList = ({
  form,
  activeLayerId,
  setActiveComponentId,
  setSidebarMode,
  handleEditComponentName,
  handleDeleteComponent,
}: {
  form: FormApi;
  activeLayerId: number;
  setActiveComponentId: (id: number | null) => void;
  setSidebarMode: (mode: 'layer' | 'component') => void;
  handleEditComponentName: (
    layerId: number,
    componentId: number,
    newNamea: string,
  ) => void;
  handleDeleteComponent: (
    e: MouseEvent | undefined,
    id: number | undefined,
    layers: Layer[],
    callback: ((layers: Layer[]) => void) | undefined,
  ) => void;
}) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [newComponentName, setNewComponentName] = useState<string>('');

  return (
    <>
      <BtnAuth onClick={() => setSidebarMode('layer')}>Back</BtnAuth>
      <form.Field name="layers">
        {(field) => {
          const activeLayer = field.state.value.find(
            (layer) => layer.id === activeLayerId,
          );

          return (
            <div className="scrollbar-primary-2 my-4 flex h-full flex-col gap-3 overflow-y-auto pb-2">
              {activeLayer?.components.map((component, index) => {
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
                        <button
                          className="hover:text-accent timing p-0.5"
                          onClick={() => {
                            if (typeof newComponentName === 'string') {
                              handleEditComponentName(
                                activeLayerId,
                                component.id,
                                newComponentName,
                              );
                            }
                            setNewComponentName(null);
                            setEditId(null);
                          }}
                        >
                          <Icon path={mdiCheckOutline} size={1} />
                        </button>
                      </>
                    ) : (
                      <>
                        <h4
                          className={`group-hover:text-accent timing grow whitespace-nowrap`}
                        >
                          {capitalCase(component.name)}
                        </h4>
                        <button
                          className="hover:text-accent timing p-0.5"
                          onClick={() => setEditId(component.id)}
                        >
                          <Icon path={mdiNoteEditOutline} size={1} />
                        </button>
                        <button
                          className="hover:text-accent timing p-0.5"
                          onClick={() =>
                            handleDeleteComponent(
                              undefined,
                              component.id,
                              field.state.value,
                              undefined,
                            )
                          }
                        >
                          <Icon path={mdiTrashCanOutline} size={1} />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }}
      </form.Field>
    </>
  );
};

export default MapComponentList;
