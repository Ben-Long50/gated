import { FieldApi } from '@tanstack/react-form';
import { CSSProperties, useState } from 'react';
import { Component, Layer } from 'src/types/map';

const MapGrid2 = ({
  field,
  width,
  height,
  baseColor,
  layers,
  tempComponent,
  getComponentStyle,
}: {
  field: FieldApi;
  width: number;
  height: number;
  baseColor: string;
  layers: Layer[];
  tempComponent: Component;
  getComponentStyle: (component: Component) => CSSProperties;
}) => {
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
      className="relative"
      style={{
        width: width * 48,
        height: height * 48,
      }}
    >
      {layers.map((layer) => {
        return (
          <div
            className="layout absolute inset-0 grid overflow-hidden shadow-lg shadow-black"
            style={{
              backgroundColor: baseColor,
              gridTemplateColumns: `repeat(${width}, 1fr)`,
              gridTemplateRows: `repeat(${height}, 1fr)`,
            }}
            onClick={() => {
              console.log('click');
            }}
          >
            {layer.components.map((component, index) => {
              return <div key={index} style={getComponentStyle(component)} />;
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
                  className="relative flex size-full items-center justify-center border border-gray-400/50"
                  style={{ gridRow: row, gridColumn: col }}
                  onMouseEnter={() => setHoveredCoords({ row, col })}
                  onClick={() => {
                    const newLayers = [
                      {
                        ...field.state.value[0],
                        components: [
                          ...field.state.value[0].components,
                          {
                            ...tempComponent,
                            mapRowStart: row,
                            mapColStart: col,
                          },
                        ],
                      },
                    ];
                    field.handleChange(newLayers);
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MapGrid2;
