import { useContext, useMemo, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Layer, Location } from 'src/types/map';
import useCombatStore from 'src/stores/combatStore';
import { useStore } from '@tanstack/react-form';
import Xarrow from 'react-xarrows';
import EncounterGridTile from './EncounterGridTile';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import { useParams } from 'react-router-dom';
import useActions from 'src/hooks/useActions';
import Loading from '../Loading';
import { EncounterContext } from 'src/contexts/EncounterContext';
import DragScrollContainer from '../mapComponents/DragScrollContainer';
import getCoords from '../mapComponents/mapUtils/getCoords';
import MapComponent from '../mapComponents/map/MapComponent';

const EncounterGrid = ({
  width,
  height,
  baseColor,
  layers,
  locations,
  gridDisplay,
  setActionSidebar,
  isDown,
}: {
  width: number;
  height: number;
  baseColor: string;
  layers: Layer[];
  locations: Location[];
  gridDisplay: boolean;
  setActionSidebar: (value: boolean) => void;
  isDown?: boolean;
}) => {
  const { statColorMap, accentPrimary } = useContext(ThemeContext);
  const { combat, activeCharacter, actionForm, rolls } =
    useContext(EncounterContext);
  const { mapId } = useParams();
  const [hoveredCoords, setHoveredCoords] = useState<{
    row: number | null;
    col: number | null;
  }>({ row: null, col: null });

  const { filteredActions: actions, isLoading: actionsLoading } = useActions(
    undefined,
    'action',
  );

  const target = useCombatStore((state) => state.target);

  const actionTarget = useStore(
    actionForm.store,
    (state) => state.values.target,
  );

  const arrowActive = activeCharacter?.id;
  const arrowTarget = actionTarget?.id || target;

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    Number(mapId),
  );

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
      over.data.current.index !== active.data.current.index &&
      combat.combatPhase === 'action'
    ) {
      if (over.data.current.inRange) {
        actionForm.setFieldValue('locationId', active.data.current.locationId);
        actionForm.setFieldValue('index', over.data.current.index);
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
            width: width * 48,
            height: height * 48,
            gridTemplateColumns: `repeat(${width}, 48px)`,
            gridTemplateRows: `repeat(${height}, 48px)`,
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
          {Array.from({ length: width * height }).map((_, index) => {
            const { row, col } = getCoords(width, index);

            const characterLocations =
              locations.filter(
                (location) => location.row === row && location.col === col,
              ) || [];

            return (
              <EncounterGridTile
                key={index}
                row={row}
                col={col}
                gridDisplay={gridDisplay}
                characterLocations={characterLocations}
                activeCoordinates={activeCoordinates}
                hoveredCoords={hoveredCoords}
                setHoveredCoords={setHoveredCoords}
                isDown={isDown}
              />
            );
          })}
          {layers.map((layer) => {
            if (!layer.hidden) {
              return (
                <div
                  id={`layer ${layer.id}`}
                  className={`layout absolute inset-px grid overflow-hidden rounded`}
                  style={{
                    gridTemplateColumns: `repeat(${width}, 1fr)`,
                    gridTemplateRows: `repeat(${height}, 1fr)`,
                  }}
                >
                  {layer.components.map((component, index) => {
                    return (
                      <MapComponent
                        key={index}
                        component={component}
                        layerId={layer.id}
                      />
                    );
                  })}
                </div>
              );
            } else {
              return;
            }
          })}
        </div>
      </DragScrollContainer>
    </DndContext>
  );
};

export default EncounterGrid;
