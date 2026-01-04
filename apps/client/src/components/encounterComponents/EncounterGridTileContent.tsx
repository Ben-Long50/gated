import { memo, useContext } from 'react';
import CharacterEncounterToken from './CharacterEncounterToken';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

const EncounterGridTileContent = memo(
  ({
    row,
    col,
    gridDisplay,
    inRange,
    rangeColor,
    hover,
    characterLocations,
    height,
    mapScale,
    activeCoordinates,
    range,
    isOver,
  }: any) => {
    const { accentPrimary } = useContext(ThemeContext);

    return (
      <div
        className={`${gridDisplay && 'border'} pointer-events-none relative flex size-full items-center justify-center`}
        style={{
          borderColor: `${accentPrimary}80`,
          gridRow: row,
          gridColumn: col,
          transition: 'background 0.2s ease',
          background: inRange
            ? `radial-gradient(circle, transparent, 75%, ${rangeColor})`
            : hover && characterLocations.length === 0
              ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
              : 'transparent',
        }}
      >
        {isOver && !inRange && (
          <Icon path={mdiClose} className="text-error size-12" />
        )}

        {characterLocations.map((location: any) => (
          <CharacterEncounterToken
            key={location.characterId}
            location={location}
            activeCoordinates={activeCoordinates}
            range={range}
            height={height}
            mapScale={mapScale}
          />
        ))}

        {hover && (
          <p
            className="bg-tertiary pointer-events-none absolute right-1/2 top-1/2 z-20 select-none whitespace-nowrap rounded p-1 py-0.5 text-sm"
            style={{
              transform:
                row > height / 2
                  ? 'translateY(-50%) translateY(-42px) translateX(50%)'
                  : 'translateY(-50%) translateY(42px) translateX(50%)',
            }}
          >
            [{col}, {row}]
          </p>
        )}
      </div>
    );
  },
);

export default EncounterGridTileContent;
