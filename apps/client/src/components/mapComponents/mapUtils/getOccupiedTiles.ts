import { Component } from 'src/types/map';

const getOccupiedTiles = (component: Component) => {
  const tiles = [];

  for (
    let col = component.mapColStart;
    col < component.mapColStart + component.width;
    col++
  ) {
    for (
      let row = component.mapRowStart;
      row < component.mapRowStart + component.height;
      row++
    ) {
      tiles.push({ col, row });
    }
  }

  return tiles;
};

export default getOccupiedTiles;
