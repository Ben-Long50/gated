import { FieldApi } from '@tanstack/react-form';
import { CSSProperties, Ref, useContext, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Component, Layer } from 'src/types/map';

const MapGrid2 = ({
  ref,
  field,
  width,
  height,
  baseColor,
  layers,
  activeLayerId,
  tempComponent,
  getComponentStyle,
  handleAddComponent,
  handleDeleteComponent,
}: {
  ref: any;
  field: FieldApi;
  width: number;
  height: number;
  baseColor: string;
  layers: Layer[];
  activeLayerId: number;
  tempComponent: Component;
  getComponentStyle: (component: Component) => CSSProperties;
  handleAddComponent: (
    e: MouseEvent,
    row: number,
    col: number,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => void;
  handleDeleteComponent: (
    e: MouseEvent,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const [hoveredCoords, setHoveredCoords] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const getCoords = (width: number, index: number) => {
    const row = Math.floor((index - 1) / width + 1);
    const col = index % width === 0 ? width : index % width;

    return { row, col };
  };

  const previewComponentStyle =
    hoveredCoords && tempComponent
      ? getComponentStyle({
          ...tempComponent,
          mapColStart: hoveredCoords.col,
          mapRowStart: hoveredCoords.row,
        })
      : {};

  return (
    <div
      ref={ref}
      className="scrollbar-primary timing relative rounded p-1 ring-1 ring-inset ring-[var(--accent-primary)]"
      style={{
        borderColor: accentPrimary,
        backgroundColor: baseColor,
        width: width * 48,
        height: height * 48,
      }}
    >
      <div
        className="pointer-events-none absolute inset-px grid rounded"
        style={{
          gridTemplateColumns: `repeat(${width}, 48px)`,
          gridTemplateRows: `repeat(${height}, 48px)`,
        }}
      >
        {Array.from({ length: width * height }).map(() => (
          <div className="border-accent bg-transparent opacity-20 ring-1 ring-inset ring-[var(--accent-primary)]" />
        ))}
      </div>
      {layers.map((layer) => {
        const active = layer.id === activeLayerId;

        if (!layer.hidden) {
          return (
            <div
              className="layout absolute inset-px grid overflow-hidden rounded"
              style={{
                gridTemplateColumns: `repeat(${width}, 1fr)`,
                gridTemplateRows: `repeat(${height}, 1fr)`,
              }}
            >
              {layer.components.map((component, index) => {
                return (
                  <div
                    key={index}
                    data-layerid={layer.id}
                    data-componentid={component.id}
                    className={`${active && 'ring-2 ring-inset ring-[var(--accent-primary)]'}`}
                    style={getComponentStyle(component)}
                  />
                );
              })}
              {tempComponent && hoveredCoords && (
                <div
                  className="pointer-events-none opacity-50"
                  style={previewComponentStyle}
                />
              )}
              {Array.from({ length: width * height }).map((_, index) => {
                const { row, col } = getCoords(width, index + 1);

                return (
                  <div
                    key={index}
                    className="relative flex size-full items-center justify-center"
                    style={{ gridRow: row, gridColumn: col }}
                    onMouseEnter={(e) => {
                      setHoveredCoords({ row, col });
                      if (e.buttons === 1) {
                        handleAddComponent(
                          e,
                          row,
                          col,
                          field.state.value,
                          field.handleChange,
                        );
                      }
                    }}
                    onMouseDown={(e) => {
                      handleAddComponent(
                        e,
                        row,
                        col,
                        field.state.value,
                        field.handleChange,
                      );
                    }}
                    onDoubleClick={(e) => {
                      handleDeleteComponent(
                        e,
                        field.state.value,
                        field.handleChange,
                      );
                    }}
                  />
                );
              })}
            </div>
          );
        } else {
          return;
        }
      })}
    </div>
  );
};

export default MapGrid2;
