import { Component } from '@gated/shared';

export const handleTileSelect = (
  row: number,
  col: number,
  tempComponent: Component | null,
  setTempComponent: (component: Component | null) => void,
  path: string | null,
) => {
  if (!path) {
    return;
  }

  if (!tempComponent || tempComponent.width > 1 || tempComponent.height > 1) {
    setTempComponent({
      name: 'Temp Component',
      id: 0,
      imageUrl: path,
      width: 1,
      height: 1,
      imageColStart: col,
      imageRowStart: row,
      mapColStart: 1,
      mapRowStart: 1,
      subComponents: [],
    });
  } else if (
    tempComponent &&
    tempComponent.height === 1 &&
    tempComponent.width === 1 &&
    tempComponent.imageColStart === col &&
    tempComponent.imageRowStart === row
  ) {
    setTempComponent(null);
  } else {
    if (!tempComponent) {
      return null;
    }

    const newTempComponent: Component = { ...tempComponent };

    if (
      tempComponent.imageColStart == null ||
      tempComponent.imageRowStart == null
    ) {
      newTempComponent.width = 1;
      newTempComponent.height = 1;
      newTempComponent.imageColStart = col;
      newTempComponent.imageRowStart = row;
    } else {
      if (col > tempComponent.imageColStart) {
        newTempComponent.width = col - tempComponent.imageColStart + 1;
      } else {
        newTempComponent.width = tempComponent.imageColStart - col + 1;
        newTempComponent.imageColStart = col;
      }
      if (row > tempComponent.imageRowStart) {
        newTempComponent.height = row - tempComponent.imageRowStart + 1;
      } else {
        newTempComponent.height = tempComponent.imageRowStart - row + 1;
        newTempComponent.imageRowStart = row;
      }
    }
    setTempComponent(newTempComponent);
  }

  return;
};
