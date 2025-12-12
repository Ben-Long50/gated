import { Location } from 'src/types/map';
import { mdiMapMarkerOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useContext, useState } from 'react';
import useNavigationStore from 'src/stores/navbarStore';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { useParams } from 'react-router-dom';
import useCharacterQueries from 'src/hooks/useCharactersQuery/useCharacterQueries';
import CharacterCardSmall from '../../CharacterCardSmall';
import Divider from '../../Divider';
import ArrowHeader3 from '../../ArrowHeader3';
import { CampaignContext } from 'src/contexts/CampaignContext';
import CharacterLocationCard from '../../CharacterLocationCard';

const MapSidebar = ({ locations }: { locations: Location[] }) => {
  const { campaignId } = useParams();
  const { gameMaster } = useContext(CampaignContext);
  const [layerSidebar, setLayerSidebar] = useState(false);

  const locatedCharacterIds = locations.map((location) => location.characterId);

  const { data: campaign } = useCampaignQuery(Number(campaignId));

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
      <Icon
        path={mdiMapMarkerOutline}
        className="text-primary ml-1 size-10 shrink-0"
      />
      <div
        className={`${layerSidebar ? 'visible translate-x-0 px-4 opacity-100' : 'invisible translate-x-full opacity-0'} timing bg-primary fixed bottom-0 right-0 z-10 flex w-full max-w-96 flex-col rounded py-4 shadow-lg shadow-black`}
        style={{ top: navbarHeight }}
      >
        <div className="flex w-full flex-col gap-4">
          <ArrowHeader3 title="Map Characters" />
          {locatedCharacterIds.length > 0 ? (
            locatedCharacterIds.map((characterId) => {
              return (
                <CharacterLocationCard
                  key={characterId}
                  locationList={true}
                  characterId={characterId}
                />
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
    </div>
  );
};

export default MapSidebar;
