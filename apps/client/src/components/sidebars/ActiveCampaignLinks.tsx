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
import { mdiCartOutline } from '@mdi/js';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Divider from '../Divider';

const ActiveCampaignLinks = () => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
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
                    {campaignCharacters.map((character, index) => {
                      const cartLength = Object.values(
                        character?.characterCart || {},
                      )
                        .filter(Array.isArray)
                        .flat()
                        .reduce((sum, item) => sum + item.quantity, 0);

                      return (
                        <div
                          key={index}
                          className="ml-4 flex w-full flex-col items-start justify-between gap-4"
                        >
                          <LinkSidebar
                            icon={
                              <CharacterPictureRound character={character} />
                            }
                            title={character?.name}
                            path={`/glam/characters/${character?.id}`}
                          />
                          {cartLength > 0 && (
                            <LinkSidebar
                              icon={
                                <div className="relative">
                                  <Icon
                                    className="bg-secondary group-hover:text-accent timing size-12 shrink-0 p-2"
                                    path={mdiCartOutline}
                                  />
                                  <p
                                    className="shadow-color absolute right-0 top-0 flex h-6 min-w-6 items-center justify-center rounded-full pt-0.5 text-center text-base font-semibold shadow-md dark:text-gray-950"
                                    style={{
                                      backgroundColor: accentPrimary,
                                    }}
                                  >
                                    {cartLength}
                                  </p>
                                </div>
                              }
                              title={`${character?.name}'s Cart`}
                              path={`/glam/campaigns/${campaign?.id}/characters/${character?.id}/cart`}
                            />
                          )}
                        </div>
                      );
                    })}
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
