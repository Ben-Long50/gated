import { capitalCase } from 'change-case';
import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../../Loading';
import useMaps from 'src/hooks/useMaps';
import BtnRect from '../../buttons/BtnRect';
import MapCard from './MapCard';

const MapList = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const mapType = searchParams.get('mapType') || '';
  const draftParam = searchParams.get('draft');

  const draft = draftParam === 'true';

  const containerRef = useRef(null);

  const { maps, isLoading } = useMaps(draft, mapType);

  if (isLoading) return <Loading />;

  return (
    <div
      ref={containerRef}
      className="flex w-full max-w-7xl flex-col items-center gap-8"
    >
      <h1>{capitalCase(mapType || 'draft')}s</h1>
      {maps && maps.length === 0 ? (
        <>
          <h3 className="text-center">
            Your campaign has no {capitalCase(mapType)}s. Head to the Map
            Builder to create a new Map or Component
          </h3>
          <BtnRect
            className="min-w-80"
            type="button"
            ariaLabel="Navigate to map builder"
            onClick={() => navigate('create')}
          >
            Map Builder
          </BtnRect>
        </>
      ) : (
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-4">
          {maps?.map((map) => {
            return <MapCard key={map.id} mapId={map.id} />;
          })}
        </div>
      )}
    </div>
  );
};

export default MapList;
