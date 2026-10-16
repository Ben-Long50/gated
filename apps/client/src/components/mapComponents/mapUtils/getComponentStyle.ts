import { Component } from '@gated/shared';
import { spriteSheetCache } from './spriteSheetCache';

const getComponentStyle = (component: Component, mapScale: number) => {
  const tileSize = 48 * mapScale;

  const sheet = component.imageUrl
    ? spriteSheetCache.get(component.imageUrl)
    : { width: 0, height: 0 };

  return {
    backgroundImage: component.imageUrl
      ? `url(${component.imageUrl})`
      : undefined,
    backgroundPosition:
      component.imageColStart && component.imageRowStart
        ? `-${(component.imageColStart - 1) * tileSize}px -${(component.imageRowStart - 1) * tileSize}px`
        : undefined,
    backgroundSize:
      component.imageUrl && sheet
        ? `${sheet.width * mapScale}px ${sheet.height * mapScale}px`
        : undefined,
    width: `${component.width * tileSize}px`,
    height: `${component.height * tileSize}px`,
    imageRendering: 'pixelated',
    backgroundRepeat: 'no-repeat',
    gridColumnStart: component.mapColStart,
    gridRowStart: component.mapRowStart,
    gridColumnEnd: component.mapColStart + component.width,
    gridRowEnd: component.mapRowStart + component.height,
    display: 'grid',
    gridColumns: `repeat(${component.width}, ${tileSize}px)`,
    gridRows: `repeat(${component.height}, ${tileSize}px)`,
  };
};

export default getComponentStyle;
