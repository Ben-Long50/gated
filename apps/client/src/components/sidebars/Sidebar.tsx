import { Fragment, ReactNode, useContext, useRef } from 'react';
import LinkSidebar from './LinkSidebar';
import { LayoutContext } from '../../contexts/LayoutContext';
import { mdiCartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import CharacterPictureRound from '../CharacterPictureRound';
import { AuthContext } from 'src/contexts/AuthContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useNavigationStore from 'src/stores/navbarStore';
import { CampaignContext } from 'src/contexts/CampaignContext';
import Divider from '../Divider';
import useCampaignCharacters from 'src/hooks/useCampaignCharacters';
import { Link, useParams } from 'react-router-dom';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import Loading from '../Loading';

const Sidebar = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { activeCampaigns, activeEncounters } = useContext(CampaignContext);

  const { campaignId } = useParams();

  const sidebarRef = useRef<null | HTMLElement>(null);

  const sidebar = useNavigationStore((state) => state.sidebar);
  const setSidebar = useNavigationStore((state) => state.setSidebar);
  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const { playerCharacters, isLoading: charactersLoading } =
    useCampaignCharacters(
      campaign?.characters.map((character) => character.id) || [],
    );

  const userCharacters =
    playerCharacters?.filter((character) => character.userId === user.id) || [];

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
        {charactersLoading ? (
          <Loading size={1.5} />
        ) : (
          userCharacters.length > 0 && (
            <>
              {userCharacters.map((character) => {
                const characterName = character?.lastName
                  ? character?.firstName + ' ' + character?.lastName
                  : character?.firstName;

                const cartLength = Object.values(character?.characterCart || {})
                  .filter(Array.isArray)
                  .flat()
                  .reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <div
                    key={character.id}
                    className="flex w-full flex-col items-start justify-between gap-4"
                  >
                    <LinkSidebar
                      icon={<CharacterPictureRound character={character} />}
                      title={characterName}
                      path={`/glam/campaigns/${campaign?.id}/characters/${character?.id}`}
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
                              style={{ backgroundColor: accentPrimary }}
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
              <Divider className="!my-0 opacity-50" />
            </>
          )
        )}
        {activeCampaigns.length > 0 &&
          activeCampaigns.map((campaign, index) => (
            <Fragment key={index}>
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
              {activeEncounters.length > 0 &&
                activeEncounters
                  .filter((encounter) => encounter.campaignId === campaign.id)
                  .map((encounter, index) => (
                    <LinkSidebar
                      key={index}
                      title={encounter.name}
                      icon={
                        <div className="liveToken z-10 size-12 shrink-0 rounded-full">
                          <img
                            className="bg-secondary size-full shrink-0 rounded-full object-cover"
                            src={encounter.map.picture.imageUrl}
                            alt={encounter.map.name + ' ' + "'s picture"}
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
              <Divider className="!my-0 opacity-50" />
            </Fragment>
          ))}

        {children}
      </div>
    </nav>
  );
};

export default Sidebar;
