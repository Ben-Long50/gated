import { useDroppable } from '@dnd-kit/core';
import { FormApi } from '@tanstack/react-form';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { handleAddComponent } from './mapBuilderUtils/handleAddComponent';
import { handleDeleteComponent } from './mapBuilderUtils/handleDeleteComponent';
import useMapBuilderStore from 'src/stores/mapBuilderStore';

const MapBuilderTile = ({
  form,
  width,
  height,
  row,
  col,
  gridDisplay,
  dragging,
}: {
  form: FormApi;
  width: number;
  height: number;
  row: number;
  col: number;
  gridDisplay: boolean;
  dragging: boolean;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const activeLayerId = useMapBuilderStore((state) => state.activeLayerId);
  const tempComponent = useMapBuilderStore((state) => state.tempComponent);
  const setTempComponent = useMapBuilderStore(
    (state) => state.setTempComponent,
  );

  const { setNodeRef } = useDroppable({
    id: `row ${row}, col ${col}`,
    data: {
      row: tempComponent?.mapRowStart || row,
      col: tempComponent?.mapColStart || col,
    },
  });

  return (
    <form.Field name="layers">
      {(field) => (
        <div
          ref={setNodeRef}
          className={`${!tempComponent && 'pointer-events-none'} ${gridDisplay && 'border'} relative z-10 flex size-full items-center justify-center`}
          style={{
            borderColor: `${accentPrimary}80`,
            gridRow: row,
            gridColumn: col,
          }}
          onMouseEnter={(e) => {
            if (!tempComponent) {
              return;
            }

            let newMapColStart =
              col > width / 2
                ? Math.floor(col - tempComponent.width / 2) + 1
                : Math.ceil(col - tempComponent.width / 2);

            if (newMapColStart + tempComponent.width > width) {
              newMapColStart = width - tempComponent.width + 1;
            }

            let newMapRowStart =
              row > height / 2
                ? Math.floor(row - tempComponent.height / 2) + 1
                : Math.ceil(row - tempComponent.height / 2);

            if (newMapRowStart + tempComponent.height > height) {
              newMapRowStart = height - tempComponent.height + 1;
            }

            const newTempComponent = {
              ...tempComponent,
              mapColStart: newMapColStart < 1 ? 1 : newMapColStart,
              mapRowStart: newMapRowStart < 1 ? 1 : newMapRowStart,
            };

            if (e.buttons === 1 && !dragging) {
              handleAddComponent(
                activeLayerId,
                newTempComponent,
                field.state.value,
                field.handleChange,
              );
            }
            setTempComponent(newTempComponent);
          }}
          onMouseDown={() => {
            handleAddComponent(
              activeLayerId,
              tempComponent,
              field.state.value,
              field.handleChange,
            );
          }}
          onDoubleClick={(e) => {
            handleDeleteComponent(
              e,
              activeLayerId,
              undefined,
              field.state.value,
              field.handleChange,
            );
          }}
        />
      )}
    </form.Field>
  );
};

export default MapBuilderTile;
