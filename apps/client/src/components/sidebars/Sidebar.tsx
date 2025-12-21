import { Fragment, ReactNode, useContext, useMemo, useRef } from 'react';
import LinkSidebar from './LinkSidebar';
import { LayoutContext } from '../../contexts/LayoutContext';
import { mdiCartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import CharacterIcon from '../icons/CharacterIcon';
import CharacterPictureRound from '../CharacterPictureRound';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useNavigationStore from 'src/stores/navbarStore';
import { CampaignContext } from 'src/contexts/CampaignContext';
import Divider from '../Divider';

const Sidebar = ({ children }: { children: ReactNode }) => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { activeCampaigns, activeEncounters } = useContext(CampaignContext);

  const sidebarRef = useRef<null | HTMLElement>(null);

  const sidebar = useNavigationStore((state) => state.sidebar);
  const setSidebar = useNavigationStore((state) => state.setSidebar);
  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  // const cartLength = useMemo(() => {
  //   return Object.values(activeCharacter?.characterCart || {})
  //     .filter(Array.isArray)
  //     .flat()
  //     .reduce((sum, item) => sum + item.quantity, 0);
  // }, [activeCharacter]);

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
        {/* {!isLoading && cartLength > 0 && (
          <LinkSidebar
            title={activeCharacter?.firstName + "'s cart"}
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
            path={`/glam/characters/${activeCharacter?.id}/cart`}
          />
        )} */}
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
                path={`/glam/campaigns/${campaign?.id}`}
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
