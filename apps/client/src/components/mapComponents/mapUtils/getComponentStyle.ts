import { Component } from 'src/types/map';
import { spriteSheetCache } from './spriteSheetCache';

const getComponentStyle = (component: Component, mapScale: number) => {
  const tileSize = 48 * mapScale;

  if (
    !component.imageUrl ||
    !component.imageColStart ||
    !component.imageRowStart
  ) {
    return {};
  }

  const sheet = spriteSheetCache.get(component.imageUrl);
  if (!sheet) return {};

  return {
    backgroundImage: `url(${component.imageUrl})`,
    backgroundPosition: `-${(component.imageColStart - 1) * tileSize}px -${(component.imageRowStart - 1) * tileSize}px`,
    backgroundSize: `${sheet.width * mapScale}px ${sheet.height * mapScale}px`,
    width: `${component.width * tileSize}px`,
    height: `${component.height * tileSize}px`,
    imageRendering: 'pixelated',
    backgroundRepeat: 'no-repeat',
    gridColumnStart: component.mapColStart,
    gridRowStart: component.mapRowStart,
    gridColumnEnd: component.mapColStart + component.width,
    gridRowEnd: component.mapRowStart + component.height,
    display: 'grid',
    gridColumns: component.width,
    gridRows: component.height,
  };
};

export default getComponentStyle;
