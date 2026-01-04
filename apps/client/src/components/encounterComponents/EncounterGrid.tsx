import {
  Fragment,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Layer, Location } from 'src/types/map';
import useCombatStore from 'src/stores/combatStore';
import { useStore } from '@tanstack/react-form';
import Xarrow from 'react-xarrows';
import EncounterGridTile from './EncounterGridTile';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import useActions from 'src/hooks/useActions';
import Loading from '../Loading';
import { EncounterContext } from 'src/contexts/EncounterContext';
import DragScrollContainer from '../mapComponents/DragScrollContainer';
import getCoords from '../mapComponents/mapUtils/getCoords';
import MapComponent from '../mapComponents/map/MapComponent';
import actionRanges from 'src/utils/actionRanges';
import { camelCase } from 'change-case';
import { socket } from 'src/socket';
import { AuthContext } from 'src/contexts/AuthContext';
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
    handleDragStart,
    handleDragUpdate,
    handleDragEnd,
    handleRemoveTarget,
  } = useEncounterArrows();

  const [hoveredTile, setHoveredTile] = useState({ row: 0, col: 0 });

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

  const gridRef = useRef<HTMLDivElement | null>(null);
  const lastTileRef = useRef<{ row: number; col: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const tileSizeRef = useRef(48 * mapScale);

  useEffect(() => {
    tileSizeRef.current = 48 * mapScale;
  }, [mapScale]);

  const handleMouseMove = (e: MouseEvent) => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      if (!gridRef.current) {
        return;
      }

      const rect = gridRef.current.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const size = tileSizeRef.current;

      const col = Math.ceil(x / size);
      const row = Math.ceil(y / size);

      const last = lastTileRef.current;
      if (last && last.row === row && last.col === col) return;

      lastTileRef.current = { row, col };
      setHoveredTile({ row, col });
    });
  };

  useEffect(() => {
    const onMouseUp = () => handleDragEnd();

    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const targets = Array.from(targetMap.entries()) as [
    string,
    {
      start: { row: number; col: number; characterId?: number };
      end: { row: number; col: number; targetId?: number };
      distance: number;
      color: string;
      occupied: boolean;
      inRange: boolean;
    },
  ][];

  return (
    <DragScrollContainer
      draggable={!measureMode}
      className={`scrollbar-primary timing relative mx-auto max-w-full overflow-y-auto rounded border-2`}
      style={{ borderColor: accentPrimary }}
    >
      <div
        ref={gridRef}
        className={`timing pointer-events-auto relative grid overflow-hidden`}
        style={{
          backgroundColor: baseColor,
          width: width * 48 * mapScale,
          height: height * 48 * mapScale,
          gridTemplateColumns: `repeat(${width}, ${48 * mapScale}px)`,
          gridTemplateRows: `repeat(${height}, ${48 * mapScale}px)`,
        }}
        onMouseMove={(e) => handleMouseMove(e)}
      >
        {targets.length > 0 &&
          targets.map(([key, target]) => (
            <Xarrow
              key={key}
              zIndex={20}
              animateDrawing={0.3}
              labels={
                <div
                  className="flex flex-col items-center rounded-md px-1"
                  style={{ backgroundColor: target.color }}
                >
                  <p className="text-sm font-semibold !text-black">{`${target.distance} Tiles`}</p>
                  {target.inRange === false && (
                    <p className="!text-error text-sm font-semibold">
                      Not in Range
                    </p>
                  )}
                  {target.occupied && (
                    <p className="!text-error text-sm font-semibold">
                      Occupied
                    </p>
                  )}
                </div>
              }
              start={`row ${target.start.row}, col ${target.start.col}`}
              end={`row ${target.end.row}, col ${target.end.col}`}
              path="straight"
              color={target.color}
              startAnchor="middle"
              endAnchor="middle"
              showTail={true}
              tailSize={3}
              headSize={5}
              headShape="arrow1"
              tailShape="circle"
            />
          ))}
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
        {hoveredTile && (
          <EncounterGridTile
            id="hoveredTile"
            row={hoveredTile.row}
            col={hoveredTile.col}
            occupied={false}
            height={height}
            activeCoordinates={activeCoordinates}
            range={range}
            rangeColor={rangeColor}
            handleDragStart={measureMode ? handleDragStart : undefined}
            handleDragUpdate={measureMode ? handleDragUpdate : undefined}
          />
        )}
        {targets.length > 0 &&
          targets.map(([_, value], index) => (
            <Fragment key={index}>
              <EncounterGridTile
                id={`row ${value.start.row}, col ${value.start.col}`}
                row={value.start.row}
                col={value.start.col}
                occupied={false}
                height={height}
                activeCoordinates={activeCoordinates}
                range={range}
                rangeColor={rangeColor}
                handleRemoveTarget={handleRemoveTarget}
              />
              <EncounterGridTile
                id={`row ${value.end.row}, col ${value.end.col}`}
                row={value.end.row}
                col={value.end.col}
                occupied={false}
                height={height}
                activeCoordinates={activeCoordinates}
                range={range}
                rangeColor={rangeColor}
              />
            </Fragment>
          ))}
        {locations.length > 0 &&
          locations.map((location) => (
            <CharacterEncounterToken
              key={location.characterId}
              location={location}
              activeCoordinates={activeCoordinates}
              range={range}
              rangeColor={rangeColor}
              height={height}
              mapScale={mapScale}
              handleDragStart={measureMode ? handleDragStart : undefined}
              handleDragUpdate={measureMode ? handleDragUpdate : undefined}
              handleRemoveTarget={
                targetMap.get(`character ${location.characterId}`)
                  ? handleRemoveTarget
                  : undefined
              }
            />
          ))}
      </div>
    </DragScrollContainer>
  );
};

export default EncounterGrid;
