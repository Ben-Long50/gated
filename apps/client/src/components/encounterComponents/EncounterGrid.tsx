import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Layer, Location } from 'src/types/map';
import useCombatStore from 'src/stores/combatStore';
import { useStore } from '@tanstack/react-form';
import Xarrow from 'react-xarrows';
import EncounterGridTile from './EncounterGridTile';
import { EncounterContext } from 'src/contexts/EncounterContext';
import DragScrollContainer from '../mapComponents/DragScrollContainer';
import getCoords from '../mapComponents/mapUtils/getCoords';
import MapComponent from '../mapComponents/map/MapComponent';
import { camelCase } from 'change-case';
import CharacterEncounterToken from './CharacterEncounterToken';
import useEncounterArrows from 'src/hooks/useEncounterArrows';
import actionFuncs from 'src/utils/actionFuncs';
import reactionFuncs from 'src/utils/reactionFuncs';
import { Action } from 'src/types/action';
import { useQueryClient } from '@tanstack/react-query';

const EncounterGrid = ({
  width,
  height,
  baseColor,
  layers,
  locations,
  mapScale,
  gridDisplay,
  measureMode,
  setActionSidebar,
}: {
  width: number;
  height: number;
  baseColor: string;
  layers: Layer[];
  locations: Location[];
  mapScale: number;
  gridDisplay: boolean;
  measureMode: boolean;
  setActionSidebar: (value: boolean) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const {
    actionPermissions,
    reactionPermissions,
    controlledCharacter,
    targetMap,
    actionForm,
    reactionForm,
  } = useContext(EncounterContext);

  const {
    isDragging,
    handleInsertArrow,
    handleDragStart,
    handleDragUpdate,
    handleDragEnd,
    handleRemoveTarget,
  } = useEncounterArrows();

  const [hoveredArrowIndex, setHoveredArrowIndex] = useState<number | null>(
    null,
  );

  const queryClient = useQueryClient();
  const tempRangeData = useCombatStore((state) => state.rangeData);
  const actionItem = useStore(actionForm.store, (state) => state.values.item);
  const reactionItem = useStore(
    reactionForm.store,
    (state) => state.values.item,
  );
  const action = useStore(actionForm.store, (state) => state.values.action);
  const reaction = useStore(
    reactionForm.store,
    (state) => state.values.reaction,
  );

  const item =
    actionPermissions || reactionPermissions
      ? actionPermissions
        ? actionItem
        : reactionItem
      : null;

  let rangeData = { range: 0, color: 'transparent' };

  if (tempRangeData) {
    rangeData = tempRangeData;
  } else if (action && actionFuncs[`${camelCase(action.name)}`]) {
    rangeData = actionFuncs[`${camelCase(action.name)}`](
      action.costs,
      controlledCharacter,
      item,
    );
  } else if (reaction && reactionFuncs[`${camelCase(reaction.name)}`]) {
    rangeData = reactionFuncs[`${camelCase(reaction.name)}`](
      reaction.costs,
      controlledCharacter,
      item,
    );
  }

  const activeCoordinates = useMemo(() => {
    if (controlledCharacter?.id) {
      const location = locations.find(
        (location) => location.characterId === controlledCharacter.id,
      );

      if (!location) {
        return null;
      }

      return { row: location.row, col: location.col };
    } else {
      return null;
    }
  }, [controlledCharacter, locations]);

  const insertTarget = (
    row: number,
    col: number,
    inRange: boolean,
    characterId?: number,
  ) => {
    if (!characterId) {
      if (actionPermissions) {
        actionForm.setFieldValue('target', null);
      } else if (reactionPermissions) {
        reactionForm.setFieldValue('target', null);
      }
    }
    if (actionPermissions) {
      handleInsertArrow(
        action.name,
        controlledCharacter.location.row,
        controlledCharacter.location.col,
        controlledCharacter.id,
        row,
        col,
        inRange,
        characterId,
      );
    } else if (reactionPermissions) {
      handleInsertArrow(
        reaction.name,
        controlledCharacter.location.row,
        controlledCharacter.location.col,
        controlledCharacter.id,
        row,
        col,
        inRange,
        characterId,
      );
    }
  };

  const tileDragStart = (row: number, col: number) => {
    if (actionPermissions) {
      handleDragStart(action.name, row, col);
    } else if (reactionPermissions) {
      handleDragStart(action.name, row, col);
    }
  };

  const tokenDragStart = (row: number, col: number, characterId: number) => {
    if (!action) {
      const basicMovement: Action = queryClient
        .getQueryData(['actions'])
        .find((action: Action) => action.name === 'Basic Movement');

      actionForm.setFieldValue('action', basicMovement);
      handleDragStart('Basic Movement', row, col, characterId);
    } else {
      handleDragStart(action, row, col, characterId);
    }
  };

  useEffect(() => {
    const onMouseUp = () => handleDragEnd();

    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const targets = [...targetMap.values()];

  return (
    <DragScrollContainer
      draggable={!measureMode}
      className={`scrollbar-primary timing relative mx-auto my-auto max-h-full max-w-full overflow-auto rounded border-2`}
      style={{ borderColor: accentPrimary }}
    >
      <div
        className={`timing pointer-events-auto relative grid overflow-hidden`}
        style={{
          backgroundColor: baseColor,
          width: width * 48 * mapScale,
          height: height * 48 * mapScale,
          gridTemplateColumns: `repeat(${width}, ${48 * mapScale}px)`,
          gridTemplateRows: `repeat(${height}, ${48 * mapScale}px)`,
        }}
      >
        {layers.map((layer, index) => {
          if (!layer.hidden) {
            return (
              <div
                key={index}
                id={`layer ${layer.id}`}
                className={`layout pointer-events-none absolute inset-px grid overflow-hidden rounded`}
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
        {Array.from({ length: width * height }).map((_, index) => {
          const { row, col } = getCoords(width, index);
          const selected = targets.some(
            (target) => target.end.row === row && target.end.col === col,
          );

          return (
            <EncounterGridTile
              key={index}
              row={row}
              col={col}
              selected={selected}
              height={height}
              activeCoordinates={activeCoordinates}
              rangeData={rangeData}
              gridDisplay={gridDisplay}
              insertTarget={insertTarget}
              tileDragStart={measureMode ? tileDragStart : undefined}
              handleDragUpdate={isDragging ? handleDragUpdate : undefined}
              handleRemoveTarget={handleRemoveTarget}
            />
          );
        })}
        {locations.length > 0 &&
          locations.map((location) => (
            <CharacterEncounterToken
              key={location.characterId}
              location={location}
              activeCoordinates={activeCoordinates}
              rangeData={rangeData}
              height={height}
              mapScale={mapScale}
              insertTarget={insertTarget}
              tokenDragStart={
                !measureMode &&
                actionPermissions &&
                location.characterId === controlledCharacter.id
                  ? tokenDragStart
                  : undefined
              }
              handleDragUpdate={isDragging ? handleDragUpdate : undefined}
              handleRemoveTarget={
                targetMap.get(`character ${location.characterId}`)
                  ? handleRemoveTarget
                  : undefined
              }
            />
          ))}
        {targets.map((targetData, index) => {
          const hovered = hoveredArrowIndex === index;
          return (
            <Xarrow
              key={index}
              animateDrawing={0}
              labels={
                <div
                  className={`${hovered ? 'rounded' : 'size-3 rounded-full'} timing group flex flex-col items-center rounded-md px-1.5`}
                  style={{ backgroundColor: targetData.color }}
                  onMouseEnter={() => setHoveredArrowIndex(index)}
                  onMouseLeave={() => setHoveredArrowIndex(null)}
                >
                  {hovered && (
                    <>
                      {targetData.action && (
                        <p className={`text-sm font-semibold !text-black`}>
                          {targetData.action}
                        </p>
                      )}
                      <p className="text-sm font-semibold !text-black">{`${targetData.distance} Tiles`}</p>
                      {targetData.inRange === false && (
                        <p className="!text-error text-sm font-semibold">
                          Not in Range
                        </p>
                      )}
                      {targetData.occupied && (
                        <p className="!text-error text-sm font-semibold">
                          Occupied
                        </p>
                      )}
                    </>
                  )}
                </div>
              }
              start={`row ${targetData.start.row}, col ${targetData.start.col}`}
              end={`row ${targetData.end.row}, col ${targetData.end.col}`}
              path="straight"
              color={targetData.color}
              startAnchor="middle"
              endAnchor="middle"
              showTail={true}
              tailSize={3}
              headSize={5}
              headShape="arrow1"
              tailShape="circle"
            />
          );
        })}
      </div>
    </DragScrollContainer>
  );
};

export default EncounterGrid;
