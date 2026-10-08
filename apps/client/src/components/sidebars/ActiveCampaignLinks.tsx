import { useContext } from 'react';
import CampaignIcon from '../icons/CampaignIcon';
import Loading from '../Loading';
import LinkListSidebar from './LinkListSidebar';
import { AuthContext } from 'src/contexts/AuthContext';
import { CampaignContext } from 'src/contexts/CampaignContext';
import useCampaignCharacters from 'src/hooks/useCampaignCharacters';
import LinkSidebar from './LinkSidebar';
import EntityAvater from '../EntityAvatar';
import LinkSublistSidebar from './LinkSublistSidebar';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import Divider from '../Divider';

const ActiveCampaignLinks = () => {
  const { user } = useContext(AuthContext);
  const { activeCampaigns, activeEncounters } = useContext(CampaignContext);

  const { playerCharacters, isLoading: charactersLoading } =
    useCampaignCharacters(
      activeCampaigns
        .flatMap((campaign) => campaign.characters)
        .map((character) => character.id) || [],
    );

  const userCharacters =
    playerCharacters?.filter((character) => character?.userId === user.id) ||
    [];

  return (
    <>
      <LinkListSidebar
        icon={
          <CampaignIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Active Campaigns"
      >
        {activeCampaigns.map((campaign, index) => {
          const campaignEncounters = activeEncounters.filter(
            (encounter) => encounter.campaignId === campaign.id,
          );

          const campaignCharacters = userCharacters.filter(
            (character) => character?.campaignId === campaign.id,
          );

          return (
            <div className="flex flex-col gap-4 pl-4 pr-2" key={index}>
              <LinkSidebar
                title={campaign?.name}
                icon={
                  <EntityAvater
                    label={campaign?.name}
                    publicId={campaign?.generatedPicture?.publicId}
                  />
                }
                path={`/glam/campaigns/${campaign?.id}`}
              />
              {campaignCharacters.length > 0 &&
                (charactersLoading ? (
                  <Loading size={1.5} />
                ) : (
                  <LinkSublistSidebar title="Your Characters">
                    {campaignCharacters.map((character) => (
                      <LinkSidebar
                        key={character.id}
                        icon={<CharacterPictureRound character={character} />}
                        title={character?.name}
                        path={`/glam/characters/${character?.id}`}
                      />
                    ))}
                  </LinkSublistSidebar>
                ))}
              {campaignEncounters.length > 0 && (
                <LinkSublistSidebar title="Encounters">
                  {campaignEncounters.map((encounter, index) => (
                    <LinkSidebar
                      key={index}
                      title={encounter.name}
                      icon={
                        <div className="liveToken z-10 ml-4 size-12 shrink-0 rounded-full">
                          <img
                            className="bg-secondary size-full shrink-0 rounded-full object-cover"
                            src={encounter?.map?.generatedPictureId.imageUrl}
                            alt={encounter.map?.name + ' ' + "'s picture"}
                          />
                        </div>
                      }
                      path={
                        encounter.combatPhase === 'pending'
                          ? `/glam/campaigns/${encounter.campaignId}/maps/${encounter.mapId}/encounters/${encounter.id}/initiative`
                          : `/glam/campaigns/${encounter.campaignId}/maps/${encounter.mapId}/encounters/${encounter.id}`
                      }
                    />
                  ))}
                </LinkSublistSidebar>
              )}
            </div>
          );
        })}
      </LinkListSidebar>
      <Divider />
    </>
  );
};

export default ActiveCampaignLinks;
