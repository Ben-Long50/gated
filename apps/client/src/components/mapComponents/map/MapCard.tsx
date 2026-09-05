import { mdiTagEdit, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowHeader3 from 'src/components/ArrowHeader3';
import IconBtnSmall from 'src/components/buttons/IconBtnSmall';
import CharacterPictureRound from 'src/components/characterComponents/CharacterPictureRound';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useMap from 'src/hooks/useMap';
import MapGrid from './MapGrid';
import { capitalCase } from 'change-case';
import ThemeContainer from 'src/components/ThemeContainer';

const MapCard = ({ mapId }: { mapId: number }) => {
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();

  const { map, locations, mapLoading } = useMap(mapId);

  let scale = (464 / (map?.width * 48)) * 0.9;
  scale = scale > 1 ? 1 : scale;

  if (mapLoading || !map) {
    return <span></span>;
  }

  return (
    <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
      <div
        className="hover:bg-secondary timing bg-primary flex cursor-pointer flex-col items-center gap-4 rounded-bl-sm rounded-tr-sm p-4 clip-6"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`${map.id}`);
        }}
      >
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full items-center gap-2">
            <ArrowHeader3 title={map.name} />
            {map.draft && (
              <p className="text-tertiary text-base">
                ({capitalCase(map.type + (map.draft ? ' draft' : ''))})
              </p>
            )}
            <p className="ml-auto whitespace-nowrap">{`${map.width} x ${map.height}`}</p>
          </div>
          {locations.length > 0 && (
            <div className="flex items-center gap-2">
              {locations.map((location) => {
                return (
                  <CharacterPictureRound
                    key={location.characterId}
                    character={location.character}
                  />
                );
              })}
            </div>
          )}
        </div>
        <MapGrid
          width={map.width}
          height={map.height}
          baseColor={map.baseColor}
          layers={map.layers}
          mapScale={scale}
          locations={[]}
          gridDisplay={false}
          className="pointer-events-none"
        />
      </div>
    </ThemeContainer>
  );
};

export default MapCard;
