import { useContext, useEffect, useMemo } from 'react';
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
import actionRanges from 'src/utils/actionRanges';
import { camelCase } from 'change-case';
import CharacterEncounterToken from './CharacterEncounterToken';
import useEncounterArrows from 'src/hooks/useEncounterArrows';

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
  const { statColorMap, accentPrimary } = useContext(ThemeContext);
  const { targetMap, activeCharacter, actionForm } =
    useContext(EncounterContext);

  const {
    isDragging,
    handleDragStart,
    handleDragUpdate,
    handleDragEnd,
    handleRemoveTarget,
  } = useEncounterArrows();

  const tempRange = useCombatStore((state) => state.range);
  const tempRangeColor = useCombatStore((state) => state.rangeColor);
  const item = useStore(actionForm.store, (state) => state.values.item);
  const action = useStore(actionForm.store, (state) => state.values.action);
  const actionType = useStore(
    actionForm.store,
    (state) => state.values.actionType,
  );

  let rangeColor = 'transparent';

  switch (actionType) {
    case 'attack':
      rangeColor = statColorMap.DMG;
      break;
    case 'movement':
      rangeColor = statColorMap.SPD;
      break;
    default:
      rangeColor = tempRangeColor || 'transparent';
      break;
  }

  const range = useMemo(() => {
    if (tempRange) {
      return tempRange;
    } else if (action && actionRanges[`${camelCase(action.name)}`]) {
      return actionRanges[`${camelCase(action.name)}`](activeCharacter, item);
    } else {
      return 0;
    }
  }, [action, item, activeCharacter, tempRange]);

  const activeCoordinates = useMemo(() => {
    if (activeCharacter?.id) {
      const location = locations.find(
        (location) => location.characterId === activeCharacter.id,
      );

      if (!location) {
        return null;
      }

      return { row: location.row, col: location.col };
    } else {
      return null;
    }
  }, [activeCharacter, locations]);

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

          return (
            <EncounterGridTile
              key={index}
              id={`row ${row}, col ${col}`}
              row={row}
              col={col}
              height={height}
              activeCoordinates={activeCoordinates}
              range={range}
              rangeColor={rangeColor}
              gridDisplay={gridDisplay}
              handleDragStart={measureMode ? handleDragStart : undefined}
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
              range={range}
              height={height}
              mapScale={mapScale}
              handleDragStart={measureMode ? handleDragStart : undefined}
              handleDragUpdate={isDragging ? handleDragUpdate : undefined}
              handleRemoveTarget={
                targetMap.get(`character ${location.characterId}`)
                  ? handleRemoveTarget
                  : undefined
              }
            />
          ))}
        {targets.map((targetData, index) => (
          <Xarrow
            key={index}
            zIndex={10}
            animateDrawing={0}
            labels={
              <div
                className="flex flex-col items-center rounded-md px-1"
                style={{ backgroundColor: targetData.color }}
              >
                <p className="text-sm font-semibold !text-black">{`${targetData.distance} Tiles`}</p>
                {targetData.inRange === false && (
                  <p className="!text-error text-sm font-semibold">
                    Not in Range
                  </p>
                )}
                {targetData.occupied && (
                  <p className="!text-error text-sm font-semibold">Occupied</p>
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
        ))}
      </div>
    </DragScrollContainer>
  );
};

export default EncounterGrid;
