import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import useMaps from 'src/hooks/useMaps';
import BtnRect from '../../buttons/BtnRect';
import InputField from 'src/components/formFields/InputField';
import MapPictureCard from './MapPictureCard';

const MapList = ({
  mapIds,
  onClick,
}: {
  mapIds: number[];
  onClick: (id: number) => void;
}) => {
  const navigate = useNavigate();

  const containerRef = useRef(null);

  const { maps, query, setQuery, sizeQuery, setSizeQuery, isLoading } =
    useMaps(mapIds);

  if (isLoading) return <Loading />;

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-8">
      <div className="grid w-full grid-cols-2 gap-4">
        <InputField
          label="Max Width"
          type="number"
          value={sizeQuery.width}
          onChange={(value) =>
            setSizeQuery((prev) => ({ ...prev, width: Number(value) }))
          }
        />
        <InputField
          label="Max Height"
          type="number"
          value={sizeQuery.height}
          onChange={(value) =>
            setSizeQuery((prev) => ({ ...prev, height: Number(value) }))
          }
        />
        <InputField
          className="col-span-2"
          label="Search Maps"
          value={query}
          onChange={(value) => setQuery(value)}
        />
      </div>
      {!maps || maps.length === 0 ? (
        <>
          <p className="text-center">No maps found</p>

          <BtnRect
            ariaLabel="Create map"
            className="w-full"
            onClick={() => navigate('/glam/maps/create')}
          >
            Create Map
          </BtnRect>
        </>
      ) : (
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
          {maps.map((map) => (
            <MapPictureCard
              key={map?.id}
              map={map}
              label={
                <div className="flex w-full items-end justify-between">
                  <p>{map?.name}</p>
                  <p>
                    {map?.width} x {map?.height}
                  </p>
                </div>
              }
              onClick={() => onClick(map.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MapList;
