import { Location } from '@gated/shared';
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
import Sidebar from 'src/components/sidebars/Sidebar';
import IconBtnSmall from 'src/components/buttons/IconBtnSmall';

const MapSidebar = ({
  locations,
  locationsLoading,
}: {
  locations: Location[];
  locationsLoading: boolean;
}) => {
  const { campaignId, mapId } = useParams();
  const { gameMaster } = useContext(CampaignContext);

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
  const sidebar = useNavigationStore((state) => state.sidebar);

  return (
    <Sidebar position="right">
      {locationsLoading ? (
        <Loading className="text-primary mb-auto" size={1.5} />
      ) : (
        <>
          <Icon
            path={mdiMapMarkerOutline}
            className="text-primary ml-1 size-10 shrink-0"
          />
          <div
            className={`${sidebar ? 'visible pl-4 opacity-100' : 'invisible opacity-0'} scrollbar-secondary-2 timing z-10 flex w-full max-w-96 flex-col overflow-y-auto rounded py-4`}
            style={{ top: navbarHeight }}
          >
            <div className="flex w-full flex-col gap-4">
              <ArrowHeader3
                className="whitespace-nowrap"
                title="Map Characters"
              />
              {locations.length > 0 ? (
                locations.map((location) => {
                  return (
                    <div className="flex items-center justify-between gap-4">
                      <CharacterLocationCard
                        key={location.id}
                        locationList={true}
                        characterId={location.characterId}
                      />
                      <IconBtnSmall
                        tooltip="Delete Location"
                        onClick={() =>
                          deleteLocation.mutate({
                            characterId: location.characterId,
                            locationId: location.id,
                          })
                        }
                      >
                        <Icon path={mdiTrashCanOutline} />
                      </IconBtnSmall>
                    </div>
                  );
                })
              ) : (
                <p className="whitespace-nowrap">No map characters</p>
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
    </Sidebar>
  );
};

export default MapSidebar;
