import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import useMaps from 'src/hooks/useMaps';
import BtnRect from '../../buttons/BtnRect';
import MapCard from './MapCard';
import { AuthContext } from 'src/contexts/AuthContext';

const MapList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const containerRef = useRef(null);

  const mapIds = user.maps.map((map) => map.id) ?? [];

  const { maps, isLoading } = useMaps(mapIds);

  if (isLoading) return <Loading />;

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-8">
      {maps && maps.length === 0 ? (
        <>
          <p className="text-center">No maps found</p>
          <BtnRect
            className="w-full"
            type="button"
            ariaLabel="Navigate to map builder"
            onClick={() => navigate('create')}
          >
            Map Builder
          </BtnRect>
        </>
      ) : (
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(360px,500px))] gap-4">
          {maps.map((map) => (
            <MapCard key={map.id} mapId={map.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MapList;
