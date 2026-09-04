import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import useMaps from 'src/hooks/useMaps';
import BtnRect from '../../buttons/BtnRect';
import MapCard from './MapCard';
import InputField from 'src/components/formFields/InputField';

const MapList = ({ mapIds }: { mapIds: number[] }) => {
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
        <p className="text-center">No maps found</p>
      ) : (
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(360px,500px))] gap-8">
          {maps.map((map) => (
            <MapCard key={map?.id} mapId={map?.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MapList;
