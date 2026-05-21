import { Layer } from 'src/types/map';
import {
  mdiCheckOutline,
  mdiCircleOutline,
  mdiDrag,
  mdiEye,
  mdiEyeClosed,
  mdiNoteEditOutline,
  mdiPuzzleOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import ArrowHeader3 from '../../ArrowHeader3';
import Divider from '../../Divider';
import { capitalCase } from 'change-case';
import BtnRect from '../../buttons/BtnRect';
import InputField from '../../InputField';
import ArrowHeader4 from '../../ArrowHeader4';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

const MapLayerList = ({
  field,
  layers,
  activeLayerId,
  setActiveLayerId,
  setPreviewLayerId,
  setSidebarMode,
  handleAddLayer,
  handleDeleteLayer,
  handleEditLayerName,
  handleHiddenLayer,
  handleLayerReorder,
}: {
  field: FieldApi;
  layers: Layer[];
  activeLayerId: number;
  setActiveLayerId: (id: number) => void;
  setPreviewLayerId: (id: number) => void;
  setSidebarMode: (mode: 'layer' | 'component') => void;
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

  const handleDragEnd = (e) => {
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
      <ArrowHeader3 className="whitespace-nowrap" title="Map Layers" />
      <Divider />
      <BtnRect type="button" ariaLabel="Add layer" onClick={handleAddLayer}>
        Add Layer
      </BtnRect>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="scrollbar-primary-2 my-4 flex h-full flex-col gap-3 overflow-y-auto pb-2">
          {layers?.map((layer, index) => {
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
          className={`text-secondary layers-center group flex w-full cursor-pointer select-none items-center gap-2`}
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
              <button
                className="hover:text-accent timing p-0.5"
                onClick={(e) => {
                  e.stopPropagation();

                  if (typeof newLayerName === 'string') {
                    handleEditLayerName(layer.id, newLayerName);
                  }
                  setNewLayerName(null);
                  setEditId(null);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon path={mdiCheckOutline} size={1} />
              </button>
            </>
          ) : (
            <>
              {active ? (
                <ArrowHeader4
                  title={capitalCase(layer.name)}
                  className={`!text-accent grow whitespace-nowrap`}
                />
              ) : (
                <h4
                  className={`group-hover:text-accent grow whitespace-nowrap`}
                >
                  {capitalCase(layer.name)}
                </h4>
              )}
              <button
                className="hover:text-accent timing p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleHiddenLayer(layer.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon path={layer.hidden ? mdiEyeClosed : mdiEye} size={1} />
              </button>
              <button
                className="hover:text-accent timing p-0.5"
                onClick={() => {
                  setActiveLayerId(layer.id);
                  setSidebarMode('component');
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon path={mdiPuzzleOutline} size={1} />
              </button>
              <button
                className="hover:text-accent timing p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditId(layer.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon path={mdiNoteEditOutline} size={1} />
              </button>
              <button
                className="hover:text-accent timing p-0.5"
                onClick={() => handleDeleteLayer(layer.id)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon path={mdiTrashCanOutline} size={1} />
              </button>
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
