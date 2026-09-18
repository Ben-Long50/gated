import { Component, Layer } from 'src/types/map';
import {
  mdiCheckOutline,
  mdiDrag,
  mdiEye,
  mdiEyeClosed,
  mdiNoteEditOutline,
  mdiPuzzleOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { capitalCase } from 'change-case';
import BtnRect from '../../buttons/BtnRect';
import InputField from '../../formFields/InputField';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import BtnAuth from 'src/components/buttons/BtnAuth';
import { FormApi } from '@tanstack/react-form';
import IconBtnSmall from 'src/components/buttons/IconBtnSmall';
import useMapBuilderStore from 'src/stores/mapBuilderStore';
import { handleLayerReorder } from './mapBuilderUtils/handleLayerReorder';
import { handleAddLayer } from './mapBuilderUtils/handleAddLayer';
import { handleEditLayerName } from './mapBuilderUtils/handleEditLayerName';
import { handleHiddenLayer } from './mapBuilderUtils/handleHiddenLayer';
import { handleDeleteLayer } from './mapBuilderUtils/handleDeleteLayer';

const MapLayerList = ({
  form,
  setSidebarMode,
}: {
  form: FormApi;
  setSidebarMode: (mode: 'layer' | 'component') => void;
}) => {
  const [indices, setIndices] = useState<{
    old: number | null;
    new: number | null;
  }>({ old: null, new: null });
  const [editId, setEditId] = useState<number | null>(null);
  const [newLayerName, setNewLayerName] = useState<string | null>(null);

  const activeLayerId = useMapBuilderStore((state) => state.activeLayerId);
  const setActiveLayerId = useMapBuilderStore(
    (state) => state.setActiveLayerId,
  );
  const setTempComponent = useMapBuilderStore(
    (state) => state.setTempComponent,
  );

  const handleDragStart = (e) => {
    const { active } = e;
    setIndices({ ...indices, old: active.data.current.index });
  };

  const handleDragOver = (e) => {
    const { over } = e;

    if (!over) {
      setIndices({ ...indices, new: null });
      return;
    }

    setIndices({ ...indices, new: over.data.current.index });
  };

  const handleDragEnd = (e, field) => {
    const { over, active } = e;

    handleLayerReorder(
      form,
      active.data.current.index,
      over.data.current.index,
      field.handleChange,
    );
    setIndices({ old: null, new: null });
  };

  return (
    <>
      <BtnRect
        className="whitespace-nowrap"
        type="button"
        ariaLabel="Add layer"
        onClick={() => handleAddLayer(form, setActiveLayerId)}
      >
        Add Layer
      </BtnRect>
      {activeLayerId && (
        <BtnAuth
          className="whitespace-nowrap"
          onClick={() => {
            setActiveLayerId(null);
            setTempComponent(null);
          }}
        >
          Deselect Layer
        </BtnAuth>
      )}
      <form.Field name="layers">
        {(field) => (
          <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={(e) => handleDragEnd(e, field)}
          >
            <div className="scrollbar-primary-2 flex h-full flex-col gap-2">
              {field.state.value.map((layer: Layer, index: number) => {
                const active = layer.id === activeLayerId;

                return (
                  <LayerListItem
                    form={form}
                    key={index}
                    index={index}
                    indices={indices}
                    layer={layer}
                    active={active}
                    editId={editId}
                    setEditId={setEditId}
                    newLayerName={newLayerName}
                    setNewLayerName={setNewLayerName}
                    setSidebarMode={setSidebarMode}
                  />
                );
              })}
            </div>
          </DndContext>
        )}
      </form.Field>
    </>
  );
};

const LayerListItem = ({
  form,
  layer,
  index,
  indices,
  active,
  editId,
  setEditId,
  newLayerName,
  setNewLayerName,
  setSidebarMode,
}: {
  form: FormApi;
  layer: Layer;
  index: number;
  indices: { old: number | null; new: number | null };
  active: boolean;
  editId: number | null;
  setEditId: (id: number | null) => void;
  newLayerName: string | null;
  setNewLayerName: (newName: string | null) => void;
  setSidebarMode: (mode: 'layer' | 'component') => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: draggableNodeRef,
    transform,
  } = useDraggable({
    id: layer.id,
    data: { index },
    disabled: !!editId,
  });

  const { setNodeRef: droppableNodeRef } = useDroppable({
    id: layer.id,
    data: { index },
  });

  const setActiveLayerId = useMapBuilderStore(
    (state) => state.setActiveLayerId,
  );
  const setPreviewLayerId = useMapBuilderStore(
    (state) => state.setPreviewLayerId,
  );

  return (
    <div ref={droppableNodeRef}>
      {indices.old !== null &&
        indices.new === index &&
        indices.new < indices.old && <hr className="border-accent border-2" />}
      <div
        className="flex w-full flex-nowrap items-center"
        style={
          transform
            ? {
                transform: `translate3d(0px, ${transform.y}px, 0)`,
                cursor: 'grabbing',
              }
            : undefined
        }
      >
        <button
          ref={draggableNodeRef}
          className="cursor-grab py-2 pr-4"
          {...listeners}
          {...attributes}
        >
          <Icon className="text-primary" path={mdiDrag} size={1} />
        </button>
        <div
          className={`text-secondary layers-center flex w-full cursor-pointer select-none flex-nowrap items-center gap-2`}
          onClick={() => setActiveLayerId(layer.id)}
          onMouseEnter={() => setPreviewLayerId(layer.id)}
          onMouseLeave={() => setPreviewLayerId(null)}
        >
          {editId === layer.id ? (
            <>
              <InputField
                label="Layer Name"
                value={newLayerName ?? layer.name}
                onChange={(value) => setNewLayerName(value)}
              />
              <IconBtnSmall
                onClick={() => {
                  if (typeof newLayerName === 'string') {
                    handleEditLayerName(form, layer.id, newLayerName);
                  }
                  setNewLayerName(null);
                  setEditId(null);
                }}
                tooltip="Confirm"
              >
                <Icon path={mdiCheckOutline} />
              </IconBtnSmall>
            </>
          ) : (
            <>
              <p
                className={`${active && '!text-accent font-semibold'} timing hover:text-accent max-w-32 grow truncate whitespace-nowrap`}
              >
                {capitalCase(layer.name)}
              </p>
              <IconBtnSmall
                onClick={() => {
                  handleHiddenLayer(form, layer.id);
                }}
                tooltip={layer.hidden ? 'Show Layer' : 'Hide Layer'}
              >
                <Icon path={layer.hidden ? mdiEyeClosed : mdiEye} />
              </IconBtnSmall>
              <IconBtnSmall
                onClick={() => {
                  setActiveLayerId(layer.id);
                  setSidebarMode('component');
                }}
                tooltip="Component List"
              >
                <Icon path={mdiPuzzleOutline} />
              </IconBtnSmall>
              <IconBtnSmall
                onClick={() => setEditId(layer.id)}
                tooltip="Edit Name"
              >
                <Icon path={mdiNoteEditOutline} />
              </IconBtnSmall>
              <IconBtnSmall
                onClick={() => handleDeleteLayer(form, layer.id)}
                tooltip="Delete"
              >
                <Icon path={mdiTrashCanOutline} />
              </IconBtnSmall>
            </>
          )}
        </div>
      </div>
      {indices.old !== null &&
        indices.new === index &&
        indices.new > indices.old && <hr className="border-accent border-2" />}
    </div>
  );
};

export default MapLayerList;
