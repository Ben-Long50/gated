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
import CharacterLocationCard from '../../characterComponents/CharacterLocationCard';
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
  const [layerSidebar, setLayerSidebar] = useState(true);

  const locatedCharacterIds = locations.map((location) => location.characterId);

  const { data: campaign } = useCampaignQuery(Number(campaignId));
  const deleteLocation = useDeleteCharacterLocationMutation(Number(mapId));

  const campaignCharacterIds = campaign?.characters
    .filter(
      (character) =>
        !locatedCharacterIds.includes(character.id) &&
        !character.npcTypes?.includes('template'),
    )
    .map((character) => character.id);

  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  return (
    <div
      className={`${layerSidebar ? 'w-96' : 'w-[72px]'} bg-base scrollbar-primary-2 timing fixed bottom-4 right-2 top-4 z-20 flex flex-col gap-2 overflow-x-hidden rounded-md p-3 shadow-md shadow-black`}
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
            className={`${layerSidebar ? 'visible translate-x-0 px-4 opacity-100' : 'invisible translate-x-full opacity-0'} scrollbar-secondary-2 timing z-10 flex w-full max-w-96 flex-col overflow-y-auto rounded py-4`}
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
                <p>No map characters</p>
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
