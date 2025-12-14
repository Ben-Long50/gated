import { Component } from 'src/types/map';

const getComponentStyle = (component: Component) => {
  return {
    backgroundImage: `url(${component.imageUrl})`,
    backgroundPosition: `-${(component.imageColStart - 1) * 48}px -${(component.imageRowStart - 1) * 48}px`,
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
