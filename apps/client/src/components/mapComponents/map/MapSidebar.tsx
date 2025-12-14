import { Location } from 'src/types/map';
import { mdiMapMarkerOutline, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useContext, useState } from 'react';
import useNavigationStore from 'src/stores/navbarStore';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { useParams } from 'react-router-dom';
import Divider from '../../Divider';
import ArrowHeader3 from '../../ArrowHeader3';
import { CampaignContext } from 'src/contexts/CampaignContext';
import CharacterLocationCard from '../../CharacterLocationCard';
import useDeleteCharacterLocationMutation from 'src/hooks/useDeleteCharacterLocationMutation/useDeleteCharacterLocationMutation';
import Loading from 'src/components/Loading';

const MapSidebar = ({
  locations,
  locationsLoading,
}: {
  locations: Location[];
  locationsLoading: boolean;
}) => {
  const { campaignId, mapId } = useParams();
  const { gameMaster } = useContext(CampaignContext);
  const [layerSidebar, setLayerSidebar] = useState(false);

  const locatedCharacterIds = locations.map((location) => location.characterId);

  const { data: campaign } = useCampaignQuery(Number(campaignId));
  const deleteLocation = useDeleteCharacterLocationMutation(Number(mapId));

  const campaignCharacterIds =
    campaign?.characters
      .map((character) => character.id)
      .filter((id) => !locatedCharacterIds.includes(id)) || [];

  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  return (
    <div
      className={`${layerSidebar ? 'w-96' : 'w-[72px]'} bg-primary scrollbar-primary-2 timing absolute right-0 top-0 z-10 flex h-full flex-col gap-2 overflow-x-hidden p-3 shadow-md shadow-black`}
      onMouseEnter={() => setLayerSidebar(true)}
      onMouseLeave={() => {
        setLayerSidebar(false);
      }}
    >
      {locationsLoading ? (
        <Loading className="text-primary mb-auto" size={1.5} />
      ) : (
        <>
          <Icon
            path={mdiMapMarkerOutline}
            className="text-primary ml-1 size-10 shrink-0"
          />
          <div
            className={`${layerSidebar ? 'visible translate-x-0 px-4 opacity-100' : 'invisible translate-x-full opacity-0'} scrollbar-secondary-2 timing bg-primary fixed bottom-0 right-0 z-10 flex w-full max-w-96 flex-col overflow-y-auto rounded py-4 shadow-lg shadow-black`}
            style={{ top: navbarHeight }}
          >
            <div className="flex w-full flex-col gap-4">
              <ArrowHeader3 title="Map Characters" />
              {locations.length > 0 ? (
                locations.map((location) => {
                  return (
                    <div className="flex items-center justify-between gap-4">
                      <CharacterLocationCard
                        key={location.id}
                        locationList={true}
                        characterId={location.characterId}
                      />
                      <button
                        className="group p-2"
                        onClick={() =>
                          deleteLocation.mutate({
                            characterId: location.characterId,
                            locationId: location.id,
                          })
                        }
                      >
                        <Icon
                          className="text-primary group-hover:text-accent timing"
                          path={mdiTrashCanOutline}
                          size={1.25}
                        />
                      </button>
                    </div>
                  );
                })
              ) : (
                <h3>N/A</h3>
              )}
            </div>
            {gameMaster && (
              <>
                <Divider />
                <div className="flex w-full flex-col gap-4">
                  <ArrowHeader3 title="Other Characters" />
                  {campaignCharacterIds.map((characterId) => {
                    return (
                      <CharacterLocationCard
                        key={characterId}
                        locationList={true}
                        characterId={characterId}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MapSidebar;
