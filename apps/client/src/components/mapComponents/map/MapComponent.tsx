import { Component } from 'src/types/map';
import getOccupiedTiles from '../mapUtils/getOccupiedTiles';
import getComponentStyle from '../mapUtils/getComponentStyle';

const MapComponent = ({
  component,
  layerId,
  mapScale,
}: {
  component: Component;
  layerId: number;
  mapScale: number;
}) => {
  const tiles = getOccupiedTiles(component);
  const style = getComponentStyle(component, mapScale);

  return (
    <div
      id={`component ${component.id}`}
      data-layer={`layer ${layerId}`}
      data-tiles={JSON.stringify(tiles)}
      className={`relative`}
      style={style}
    >
      {component.subComponents &&
        component.subComponents.length > 0 &&
        component.subComponents.map((component) => (
          <div style={getComponentStyle(component, mapScale)} />
        ))}
    </div>
  );
};

export default MapComponent;
