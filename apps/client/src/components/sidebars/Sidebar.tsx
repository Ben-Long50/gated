import { ReactNode, useContext, useRef } from 'react';
import LinkSidebar from './LinkSidebar';
import { LayoutContext } from '../../contexts/LayoutContext';
import { mdiCartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import { AuthContext } from 'src/contexts/AuthContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useNavigationStore from 'src/stores/navbarStore';
import { CampaignContext } from 'src/contexts/CampaignContext';
import Divider from '../Divider';
import useCampaignCharacters from 'src/hooks/useCampaignCharacters';
import Loading from '../Loading';
import LinkListSidebar from './LinkListSidebar';
import CampaignIcon from '../icons/CampaignIcon';
import LinkSublistSidebar from './LinkSublistSidebar';
import constructName from 'src/utils/constructName';

const Sidebar = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { activeCampaigns, activeEncounters } = useContext(CampaignContext);

  const sidebarRef = useRef<null | HTMLElement>(null);

  const sidebar = useNavigationStore((state) => state.sidebar);
  const setSidebar = useNavigationStore((state) => state.setSidebar);
  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  const { playerCharacters, isLoading: charactersLoading } =
    useCampaignCharacters(
      activeCampaigns
        .flatMap((campaign) => campaign.characters)
        .map((character) => character.id) || [],
    );

  const userCharacters =
    playerCharacters?.filter((character) => character?.userId === user.id) ||
    [];

  const sidebarStyle = sidebar ? 'w-full max-w-96' : 'min-w-0 max-w-[68px]';

  const mobileSidebarStyle = sidebar
    ? 'w-full max-w-85dvw'
    : 'w-full max-w-85dvw -translate-x-[101%]';

  return (
    <nav
      ref={sidebarRef}
      className={`${mobile ? mobileSidebarStyle : sidebarStyle} bg-secondary timing fixed z-20 col-start-1 row-start-1 flex overflow-x-hidden border-r`}
      style={{
        height: `calc(100dvh - ${navbarHeight}px)`,
        top: `${navbarHeight}px`,
        borderColor: accentPrimary,
      }}
      onMouseEnter={() => {
        if (!mobile) setSidebar(true);
      }}
      onMouseLeave={() => {
        if (!mobile) setSidebar(false);
      }}
    >
      <div className="scrollbar-secondary flex grow flex-col gap-4 overflow-y-auto overflow-x-hidden px-2 py-4">
        {activeCampaigns.length > 0 && (
          <LinkListSidebar
            icon={
              <CampaignIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
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
                      <div className="liveCampaign z-10 size-12 shrink-0 rounded-full">
                        <img
                          className="bg-secondary size-full shrink-0 rounded-full object-cover"
                          src={campaign?.picture.imageUrl}
                          alt={campaign?.name + ' ' + "'s cover picture"}
                        />
                      </div>
                    }
                    path={`/glam/campaigns/${campaign?.id}?npcType=shop`}
                  />
                  {campaignCharacters.length > 0 &&
                    (charactersLoading ? (
                      <Loading size={1.5} />
                    ) : (
                      <LinkSublistSidebar title="Your Characters">
                        {campaignCharacters.map((character, index) => {
                          const characterName = constructName(character);

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
                                  <CharacterPictureRound
                                    character={character}
                                  />
                                }
                                title={characterName}
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
                                  title={`${character?.firstName}'s Cart`}
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
                                src={encounter?.map?.picture.imageUrl}
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
        )}
        <Divider className="!my-0 opacity-50" />
        {children}
      </div>
    </nav>
  );
};

export default Sidebar;
