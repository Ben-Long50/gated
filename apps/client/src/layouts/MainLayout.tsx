import { useContext, useRef } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { LayoutContext } from '../contexts/LayoutContext';
import Sidebar from '../components/sidebars/Sidebar';
import CodexLinks from '../components/sidebars/CodexLinks';
import CharacterListLinks from '../components/sidebars/CharacterListLinks';
import CampaignLinks from '../components/sidebars/CampaignLinks';
import AccountLinks from '../components/sidebars/AccountLinks';
import useNavigationStore from 'src/stores/navbarStore';
import { CampaignContext } from 'src/contexts/CampaignContext';
import DieIcon from 'src/components/icons/DieIcon';
import CharacterLinks from 'src/components/sidebars/CharacterLinks';
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {
  const { theme, accentPrimary } = useContext(ThemeContext);
  const { rolls } = useContext(CampaignContext);
  const { mobile } = useContext(LayoutContext);
  const { pathname } = useLocation();
  const { encounterId, characterId } = useParams();
  const navigate = useNavigate();

  const navbar = useNavigationStore((state) => state.navbar);
  const setNavbar = useNavigationStore((state) => state.setNavbar);
  const sidebar = useNavigationStore((state) => state.sidebar);
  const setSidebar = useNavigationStore((state) => state.setSidebar);
  const encounterLayout = useNavigationStore((state) => state.encounterLayout);

  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  const navbarRef = useRef(null);

  const rollsArray = Array.from(rolls.values());

  return (
    <div
      className={`${theme} relative z-10 min-h-dvh w-dvw`}
      style={
        {
          '--accent-primary': accentPrimary,
        } as React.CSSProperties
      }
    >
      {!encounterId && (
        <Sidebar>
          {pathname.startsWith('/glam/codex') && <CodexLinks />}
          {pathname.startsWith('/glam/characters') ? (
            characterId ? (
              <CharacterLinks />
            ) : (
              <CharacterListLinks />
            )
          ) : null}
          {pathname.startsWith('/glam/campaigns') && <CampaignLinks />}
          {pathname.startsWith('/glam/account') && <AccountLinks />}
        </Sidebar>
      )}
      <div
        className="flex flex-col items-center gap-8 px-4 pb-4"
        style={{ marginLeft: navbarHeight + 12 }}
      >
        <Navbar navbarRef={navbarRef} />
        <div
          id="portal-root"
          className={`relative flex w-full flex-col items-center`}
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
          {rollsArray.length > 0 && (
            <button
              className="bg-secondary group fixed bottom-4 right-4 rounded p-2 shadow-md shadow-black"
              onClick={() => navigate('/glam/rollResults')}
            >
              <DieIcon className="group-hover:text-accent text-primary size-10" />
            </button>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        theme="dark"
      />
    </div>
  );
};

export default MainLayout;
