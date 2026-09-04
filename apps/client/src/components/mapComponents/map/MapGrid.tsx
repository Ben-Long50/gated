import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Layer, Location } from 'src/types/map';
import DragScrollContainer from '../DragScrollContainer';
import MapGridTile from './MapGridTile';
import MapComponent from './MapComponent';
import getCoords from '../mapUtils/getCoords';

const MapGrid = ({
  width,
  height,
  baseColor,
  layers,
  mapScale,
  locations,
  gridDisplay,
  className,
}: {
  width: number;
  height: number;
  baseColor: string;
  layers: Layer[];
  mapScale: number;
  locations: Location[];
  gridDisplay: boolean;
  className?: string;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <DragScrollContainer
      draggable={true}
      className={`${className} scrollbar-primary timing relative max-h-full max-w-full overflow-y-auto rounded border-2`}
      style={{ borderColor: accentPrimary }}
    >
      <div
        className={`timing relative grid overflow-hidden`}
        style={{
          backgroundColor: baseColor,
          width: width * 48 * mapScale,
          height: height * 48 * mapScale,
          gridTemplateColumns: `repeat(${width}, ${48 * mapScale}px)`,
          gridTemplateRows: `repeat(${height}, ${48 * mapScale}px)`,
        }}
      >
        {Array.from({ length: width * height }).map((_, index) => {
          const { row, col } = getCoords(width, index);

          const characterLocations =
            locations.length > 0
              ? locations.filter(
                  (location) => location.row === row && location.col === col,
                )
              : [];

          return (
            <MapGridTile
              key={index}
              row={row}
              col={col}
              height={height}
              characterLocations={characterLocations}
              gridDisplay={gridDisplay}
              mapScale={mapScale}
            />
          );
        })}
        {layers.map((layer) => {
          if (!layer.hidden) {
            return (
              <div
                key={layer.id}
                id={`layer ${layer.id}`}
                className={`layout absolute inset-px grid overflow-hidden rounded`}
                style={{
                  gridTemplateColumns: `repeat(${width}, ${48 * mapScale}px)`,
                  gridTemplateRows: `repeat(${height}, ${48 * mapScale}px)`,
                }}
              >
                {layer.components.map((component, index) => {
                  return (
                    <MapComponent
                      key={index}
                      component={component}
                      layerId={layer.id}
                      mapScale={mapScale}
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
    </DragScrollContainer>
  );
};

export default MapGrid;
