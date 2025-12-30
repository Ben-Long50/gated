import { useContext, useMemo } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Layer, Location } from 'src/types/map';
import useCombatStore from 'src/stores/combatStore';
import { useStore } from '@tanstack/react-form';
import Xarrow from 'react-xarrows';
import EncounterGridTile from './EncounterGridTile';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import useActions from 'src/hooks/useActions';
import Loading from '../Loading';
import { EncounterContext } from 'src/contexts/EncounterContext';
import DragScrollContainer from '../mapComponents/DragScrollContainer';
import getCoords from '../mapComponents/mapUtils/getCoords';
import MapComponent from '../mapComponents/map/MapComponent';
import useCharacter from 'src/hooks/useCharacter';
import actionRanges from 'src/utils/actionRanges';
import { camelCase } from 'change-case';

const EncounterGrid = ({
  width,
  height,
  baseColor,
  layers,
  locations,
  mapScale,
  gridDisplay,
  setActionSidebar,
}: {
  width: number;
  height: number;
  baseColor: string;
  layers: Layer[];
  locations: Location[];
  mapScale: number;
  gridDisplay: boolean;
  setActionSidebar: (value: boolean) => void;
}) => {
  const { statColorMap, accentPrimary } = useContext(ThemeContext);
  const { combat, activeCharacter, actionForm, rolls } =
    useContext(EncounterContext);

  const { filteredActions: actions, isLoading: actionsLoading } = useActions(
    undefined,
    'action',
  );

  const { filteredCharacter: character } = useCharacter(activeCharacter?.id);

  const target = useCombatStore((state) => state.target);
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
    return tempRange
      ? tempRange
      : action && actionRanges[`${camelCase(action.name)}`]
        ? actionRanges[`${camelCase(action.name)}`](activeCharacter, item)
        : 0;
  }, [action, item, activeCharacter, tempRange]);

  const actionTarget = useStore(
    actionForm.store,
    (state) => state.values.target,
  );

  const arrowActive = activeCharacter?.id;

  const arrowTarget = actionTarget?.id || target;

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

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    if (!over?.data.current || !active.data.current) {
      return;
    }

    setActionSidebar(false);
    if (
      (over.data.current.row !== active.data.current.row ||
        over.data.current.col !== active.data.current.col) &&
      combat.combatPhase === 'action'
    ) {
      if (over.data.current.inRange) {
        actionForm.setFieldValue('locationId', active.data.current.locationId);
        actionForm.setFieldValue('row', over.data.current.row);
        actionForm.setFieldValue('col', over.data.current.col);
        actionForm.handleSubmit();
      } else {
        alert('Not in range');
      }
    } else {
      console.log('Action cancelled');
    }
  };

  const handleDragStart = () => {
    setActionSidebar(true);
    const selectedAction = actionForm.getFieldValue('action') || null;

    actionForm.setFieldValue('actionType', 'movement');
    if (actions && !selectedAction) {
      actionForm.setFieldValue(
        'action',
        actions.find((action) => action.name === 'Basic Movement'),
      );
    }
  };

  const locationMap = useMemo(() => {
    const map = new Map();

    for (const loc of locations) {
      const key = `${loc.row},${loc.col}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(loc);
    }

    return map;
  }, [locations]);

  if (actionsLoading) return <Loading />;

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <DragScrollContainer
        draggable={true}
        className={`scrollbar-primary timing pointer-events-auto relative mx-auto mb-auto max-h-full max-w-full overflow-y-auto rounded border-2`}
        style={{ borderColor: accentPrimary }}
      >
        <div
          className={`timing relative grid overflow-hidden`}
          style={{
            backgroundColor: baseColor,
            width: width * 48 * mapScale,
            height: height * 48 * mapScale,
            gridTemplateColumns: `repeat(${width}, ${48 * mapScale}px)`,
            gridTemplateRows: `repeat(${height}, ${48 * mapScale}px)`,
          }}
        >
          {arrowActive && arrowTarget && (
            <Xarrow
              zIndex={20}
              animateDrawing={0.3}
              start={arrowActive.toString()}
              end={arrowTarget?.toString()}
              path="straight"
              color={statColorMap.DMG}
              startAnchor="middle"
              endAnchor="middle"
              showTail={true}
              tailSize={3}
              headSize={5}
              headShape="arrow1"
              tailShape="circle"
            />
          )}

          {layers.map((layer, index) => {
            if (!layer.hidden) {
              return (
                <div
                  key={index}
                  id={`layer ${layer.id}`}
                  className={`layout absolute inset-px grid overflow-hidden rounded`}
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

            const key = `${row},${col}`;

            const characterLocations = locationMap.get(key) ?? [];

            return (
              <EncounterGridTile
                key={index}
                row={row}
                col={col}
                height={height}
                gridDisplay={gridDisplay}
                mapScale={mapScale}
                characterLocations={characterLocations}
                activeCoordinates={activeCoordinates}
                range={range}
                rangeColor={rangeColor}
              />
            );
          })}
        </div>
      </DragScrollContainer>
    </DndContext>
  );
};

export default EncounterGrid;
