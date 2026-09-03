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
import ArrowHeader4 from '../../ArrowHeader4';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import BtnAuth from 'src/components/buttons/BtnAuth';
import { FormApi } from '@tanstack/react-form';
import IconBtnSmall from 'src/components/buttons/IconBtnSmall';

const MapLayerList = ({
  form,
  activeLayerId,
  setActiveLayerId,
  setPreviewLayerId,
  setSidebarMode,
  setTempComponent,
  handleAddLayer,
  handleDeleteLayer,
  handleEditLayerName,
  handleHiddenLayer,
  handleLayerReorder,
}: {
  form: FormApi;
  activeLayerId: number;
  setActiveLayerId: (id: number) => void;
  setPreviewLayerId: (id: number) => void;
  setSidebarMode: (mode: 'layer' | 'component') => void;
  setTempComponent: (component: Component | null) => void;
  handleAddLayer: () => void;
  handleDeleteLayer: (id: number) => void;
  handleEditLayerName: (id: number, newName: string) => void;
  handleHiddenLayer: (id: number) => void;
  handleLayerReorder: (
    oldIndex: number,
    newIndex: number,
    callback: (layers: Layer[]) => void,
  ) => void;
}) => {
  const [indices, setIndices] = useState<{
    old: number | null;
    new: number | null;
  }>({ old: null, new: null });
  const [editId, setEditId] = useState<number | null>(null);
  const [newLayerName, setNewLayerName] = useState<string | null>(null);

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
      active.data.current.index,
      over.data.current.index,
      field.handleChange,
    );
    setIndices({ old: null, new: null });
  };

  return (
    <>
      <BtnRect type="button" ariaLabel="Add layer" onClick={handleAddLayer}>
        Add Layer
      </BtnRect>
      {activeLayerId && (
        <BtnAuth
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
            <div className="scrollbar-primary-2 flex h-full flex-col gap-2 overflow-y-auto">
              {field.state.value.map((layer, index) => {
                const active = layer.id === activeLayerId;

                return (
                  <LayerListItem
                    key={index}
                    index={index}
                    indices={indices}
                    layer={layer}
                    active={active}
                    editId={editId}
                    setEditId={setEditId}
                    newLayerName={newLayerName}
                    setNewLayerName={setNewLayerName}
                    setActiveLayerId={setActiveLayerId}
                    setPreviewLayerId={setPreviewLayerId}
                    setSidebarMode={setSidebarMode}
                    handleDeleteLayer={handleDeleteLayer}
                    handleEditLayerName={handleEditLayerName}
                    handleHiddenLayer={handleHiddenLayer}
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
  layer,
  index,
  indices,
  active,
  editId,
  setEditId,
  newLayerName,
  setNewLayerName,
  setActiveLayerId,
  setPreviewLayerId,
  setSidebarMode,
  handleDeleteLayer,
  handleEditLayerName,
  handleHiddenLayer,
}: {
  layer: Layer;
  index: number;
  indices: { old: number | null; new: number | null };
  active: boolean;
  editId: number | null;
  setEditId: (id: number | null) => void;
  newLayerName: string | null;
  setNewLayerName: (newName: string | null) => void;
  setActiveLayerId: (id: number) => void;
  setPreviewLayerId: (id: number) => void;
  setSidebarMode: (mode: 'layer' | 'component') => void;
  handleDeleteLayer: (id: number) => void;
  handleEditLayerName: (id: number, newName: string) => void;
  handleHiddenLayer: (id: number) => void;
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

  const { isOver, setNodeRef: droppableNodeRef } = useDroppable({
    id: layer.id,
    data: { index },
  });

  return (
    <div ref={droppableNodeRef}>
      {indices.old !== null &&
        indices.new === index &&
        indices.new < indices.old && <hr className="border-accent border-2" />}
      <div
        className="flex w-full items-center"
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
          className={`text-secondary layers-center flex w-full cursor-pointer select-none items-center gap-2`}
          onClick={() => setActiveLayerId(layer.id)}
          onMouseEnter={() => setPreviewLayerId(layer.id)}
          onMouseLeave={() => setPreviewLayerId(null)}
        >
          {editId === layer.id ? (
            <>
              <InputField
                label="Layer Name"
                value={layer.name || newLayerName}
                onChange={(value) => setNewLayerName(value)}
              />
              <IconBtnSmall
                onClick={() => {
                  if (typeof newLayerName === 'string') {
                    handleEditLayerName(layer.id, newLayerName);
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
                className={`${active && '!text-accent font-semibold'} timing hover:text-accent grow whitespace-nowrap`}
              >
                {capitalCase(layer.name)}
              </p>
              <IconBtnSmall
                onClick={() => {
                  handleHiddenLayer(layer.id);
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
                onClick={() => handleDeleteLayer(layer.id)}
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
