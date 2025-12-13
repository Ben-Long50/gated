import { useContext, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { LayoutContext } from '../contexts/LayoutContext';
import Sidebar from '../components/sidebars/Sidebar';
import CodexLinks from '../components/sidebars/CodexLinks';
import CharacterLinks from '../components/sidebars/CharacterLinks';
import CampaignLinks from '../components/sidebars/CampaignLinks';
import AccountLinks from '../components/sidebars/AccountLinks';
import useNavigationStore from 'src/stores/navbarStore';
import { CampaignProvider } from 'src/contexts/CampaignContext';

const MainLayout = () => {
  const { theme, accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);
  const { pathname } = useLocation();
  const { encounterId } = useParams();

  const navbar = useNavigationStore((state) => state.navbar);
  const setNavbar = useNavigationStore((state) => state.setNavbar);
  const sidebar = useNavigationStore((state) => state.sidebar);
  const setSidebar = useNavigationStore((state) => state.setSidebar);
  const encounterLayout = useNavigationStore((state) => state.encounterLayout);

  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  const navbarRef = useRef(null);

  return (
    <CampaignProvider>
      <div
        className={`${theme} main-layout-large relative min-h-dvh w-dvw`}
        style={{ '--accent-primary': accentPrimary } as React.CSSProperties}
      >
        <Navbar navbarRef={navbarRef} />
        {!encounterId && (
          <Sidebar>
            {pathname.startsWith('/glam/codex') && <CodexLinks />}
            {pathname.startsWith('/glam/characters') && <CharacterLinks />}
            {pathname.startsWith('/glam/campaigns') && <CampaignLinks />}
            {pathname.startsWith('/glam/account') && <AccountLinks />}
          </Sidebar>
        )}
        <div
          id="portal-root"
          className={`${!mobile && !encounterLayout && 'ml-[68px]'} ${encounterLayout && 'sm:px-20 sm:py-2.5'} relative z-10 col-span-2 col-start-1 row-start-1 flex flex-col items-center px-2 py-4 max-xl:col-start-1 sm:p-8`}
          style={{
            marginTop: navbarHeight,
            height: `calc(100dvh - ${navbarHeight}px)`,
          }}
        >
          {mobile && (
            <div
              className={`${navbar || sidebar ? 'visible h-full bg-black bg-opacity-50 backdrop-blur-md' : 'invisible bg-transparent bg-opacity-0 backdrop-blur-0'} timing absolute top-0 z-20 w-dvw`}
              onClick={(e) => {
                e.stopPropagation();
                setNavbar(false);
                setSidebar(false);
              }}
            />
          )}
          <Outlet />
        </div>
      </div>
    </CampaignProvider>
  );
};

export default MainLayout;
