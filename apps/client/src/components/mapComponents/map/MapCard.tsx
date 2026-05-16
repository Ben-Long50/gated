import { mdiTagEdit, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useNavigate } from 'react-router-dom';
import ArrowHeader3 from 'src/components/ArrowHeader3';
import CharacterPictureRound from 'src/components/CharacterPictureRound';
import CloudinaryPicture from 'src/components/CloudinaryPicture';
import useMap from 'src/hooks/useMap';

const MapCard = ({ mapId }: { mapId: number }) => {
  const navigate = useNavigate();

  const { map, locations, mapLoading } = useMap(mapId);

  if (mapLoading || !map) {
    return <span></span>;
  }

  return (
    <div
      className={`hover:border-accent bg-secondary timing flex flex-col gap-4 rounded-md border-2 border-transparent p-4 shadow-md shadow-black`}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`${map.id}`);
      }}
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex w-full items-center gap-2">
          <ArrowHeader3 title={map.name} />
          {map.draft && <p className="text-tertiary text-base">(draft)</p>}
          <p className="ml-auto whitespace-nowrap">{`${map.width} x ${map.height}`}</p>
        </div>
        <div className="ml-auto flex w-full items-center">
          <p className="mr-auto">{`Author - ${map.user.username}`}</p>
          <button
            className="group p-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`${map.id}/update`);
            }}
          >
            <Icon
              className="text-secondary group-hover:text-accent timing size-6"
              path={mdiTagEdit}
            />
          </button>
          <button
            className="group p-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`${map.id}/delete`);
            }}
          >
            <Icon
              className="text-secondary group-hover:text-accent timing size-6"
              path={mdiTrashCanOutline}
            />
          </button>
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

      <div className="flex h-80 w-full items-center justify-center">
        <CloudinaryPicture
          className="border-accent overflow-hidden rounded border"
          publicId={map.picture.publicId}
        />
      </div>
    </div>
  );
};

export default MapCard;
