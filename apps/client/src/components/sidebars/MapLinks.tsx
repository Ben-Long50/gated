import LinkListSidebar from './LinkListSidebar';
import SubLinkSidebar from './SubLinkSidebar';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import Loading from '../Loading';
import LinkSidebar from './LinkSidebar';
import CreateCharacterIcon from '../icons/CreateCharacterIcon';
import MapIcon from '../icons/MapIcon';
import EntityAvater from '../EntityAvatar';
import useMaps from 'src/hooks/useMaps';

const MapLinks = () => {
  const { user } = useContext(AuthContext);

  const mapIds = user.maps.map((map) => map.id) ?? [];

  const { maps, isLoading } = useMaps(mapIds);

  return (
    <>
      <LinkListSidebar
        icon={
          <MapIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Map Categories"
      >
        <SubLinkSidebar title="All Maps" path="maps" />
        <SubLinkSidebar title="Maps" path="maps?mapType=map" />
        <SubLinkSidebar title="Map Drafts" path="maps?draft=true&mapType=map" />
        <SubLinkSidebar title="Components" path="maps?mapType=component" />
        <SubLinkSidebar
          title="Component Drafts"
          path="maps?draft=true&mapType=component"
        />
      </LinkListSidebar>
      <LinkSidebar
        icon={
          <CreateCharacterIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Create Map"
        path="maps/create"
      />

      {isLoading ? (
        <Loading size={1.5} />
      ) : (
        maps.map((map) => {
          return (
            <LinkSidebar
              key={map.id}
              title={map.name}
              icon={
                <EntityAvater
                  publicId={map.generatedPicture?.publicId}
                  label={map.name}
                />
              }
              path={`maps/${map.id}`}
            />
          );
        })
      )}
    </>
  );
};

export default MapLinks;
