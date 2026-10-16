import { Component } from '@gated/shared';
import getOccupiedTiles from '../../mapUtils/getOccupiedTiles';

export const findConflict = (
  activeLayerId: number | null,
  component: Component,
) => {
  if (!component) {
    return;
  }

  const tiles = getOccupiedTiles(component);

  const layer = document.getElementById(`layer ${activeLayerId}`);

  if (!layer) {
    return;
  }

  const componentTiles = Array.from(layer.children)
    .filter(
      (child) =>
        child.id &&
        child instanceof HTMLDivElement &&
        child.id !== `component ${component.id}`,
    )
    .flatMap((component) => JSON.parse(component.dataset.tiles.split(',')));

  const conflict = tiles.some((tile) =>
    componentTiles.some(
      (compTile) => compTile.row === tile.row && compTile.col === tile.col,
    ),
  );

  return conflict;
};
