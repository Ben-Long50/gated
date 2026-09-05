import { RefObject, useContext, useEffect, useLayoutEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutContext } from '../contexts/LayoutContext';
import Icon from '@mdi/react';
import { mdiBellOutline, mdiMenu, mdiMenuClose, mdiMenuOpen } from '@mdi/js';
import NavMenuMobile from './NavMenuMobile';
import CharacterIcon from './icons/CharacterIcon';
import AccountPicture from './AccountPicture';
import Divider from './Divider';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useNavigationStore from 'src/stores/navbarStore';
import LinkNavbar from './buttons/LinkNavbar';

const Navbar = ({
  navbarRef,
}: {
  navbarRef: RefObject<null | HTMLDivElement>;
}) => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);

  const navbar = useNavigationStore((state) => state.navbar);
  const sidebar = useNavigationStore((state) => state.sidebar);
  const setNavbar = useNavigationStore((state) => state.setNavbar);
  const setSidebar = useNavigationStore((state) => state.setSidebar);
  const closeBars = useNavigationStore((state) => state.closeBars);
  const setNavbarHeight = useNavigationStore((state) => state.setNavbarHeight);

  useLayoutEffect(() => {
    if (navbarRef.current) {
      const rect = navbarRef.current.getBoundingClientRect();
      setNavbarHeight(rect.height);
    }
  }, [navbarRef]);

  return mobile ? (
    <nav
      ref={navbarRef}
      className={`bg-primary timing shadow-color sticky top-0 z-10 flex w-full flex-col items-center justify-start shadow-md`}
    >
      <div className="flex w-full items-center justify-between px-2 py-2">
        <button
          onClick={() => {
            setNavbar(false);
            setSidebar(!sidebar);
          }}
        >
          <Icon
            className="text-secondary size-10"
            path={sidebar ? mdiMenuOpen : mdiMenuClose}
          />
        </button>
        <div className="flex items-center justify-end gap-4">
          <Link
            className="relative"
            to={`account/${user?.id}/notifications`}
            onClick={() => {
              closeBars();
            }}
          >
            <Icon path={mdiBellOutline} className="text-secondary size-8" />
            {/* {user?._count.receivedNotifications > 0 && (
              <div
                className="shadow-color absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: accentPrimary }}
              >
                <p className="text-sm font-semibold !text-zinc-900 sm:pt-0.5">
                  {user?._count?.receivedNotifications}
                </p>
              </div>
            )} */}
          </Link>
          <button
            className={`${navbar && 'scale-y-150'} timing z-10`}
            onClick={() => {
              setSidebar(false);
              setNavbar(!navbar);
            }}
          >
            <Icon path={mdiMenu} size={1.5} className={`text-secondary`} />
          </button>
          <Link to={`account/${user.id}`} className="flex items-center">
            <button
              className="z-10"
              onClick={() => {
                setNavbar(false);
              }}
            >
              {user?.profilePicture ? (
                <img
                  className="size-10 rounded-full"
                  src={user?.profilePicture}
                  alt="Profile Picture"
                />
              ) : (
                <CharacterIcon className="text-secondary size-10" />
              )}
            </button>
          </Link>
        </div>
      </div>
      <NavMenuMobile>
        <Link className="w-full p-1" to="codex?tab=equipment">
          <button
            className="text-primary w-full text-left"
            onClick={() => {
              setNavbar(false);
            }}
          >
            Codex
          </button>
        </Link>
        <Divider />
        <Link className="w-full p-1" to="campaigns">
          <button
            className="text-primary w-full text-left"
            onClick={() => {
              setNavbar(false);
            }}
          >
            Campaigns
          </button>
        </Link>
        <Divider />
        <Link className="w-full p-1" to="characters">
          <button
            className="text-primary w-full text-left"
            onClick={() => {
              setNavbar(false);
            }}
          >
            Characters
          </button>
        </Link>
        <Divider />
        <Link className="w-full p-1" to="maps">
          <button
            className="text-primary w-full text-left"
            onClick={() => {
              setNavbar(false);
            }}
          >
            Maps
          </button>
        </Link>
      </NavMenuMobile>
    </nav>
  ) : (
    <div
      className="sticky top-0 z-10 flex w-full justify-center"
      ref={navbarRef}
    >
      <nav
        className={`bg-base timing shadow-color mx-auto mt-3 flex w-full max-w-9xl items-center gap-8 rounded-md px-8 py-2 shadow-lg`}
      >
        <Link to="/glam/codex">
          <h2
            className="text-shadow-color text-shadow font-zen !text-4xl italic text-shadow-x-1 text-shadow-y-1"
            style={{ color: accentPrimary }}
          >
            EDO
          </h2>
        </Link>
        <div className="flex w-full grow items-center justify-end gap-4">
          <div className="relative grid grow grid-cols-4 items-center justify-items-end gap-4">
            <LinkNavbar path="codex?tab=equipment">Codex</LinkNavbar>
            <LinkNavbar path="campaigns">Campaigns</LinkNavbar>
            <LinkNavbar path="characters?excludedNpcType=template">
              Characters
            </LinkNavbar>
            <LinkNavbar path="maps">Maps</LinkNavbar>
          </div>
          <Link className="relative" to={`account/${user?.id}/notifications`}>
            <Icon path={mdiBellOutline} className="text-secondary size-8" />
          </Link>
          <Link to={`account/${user?.id}`}>
            <AccountPicture user={user} />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
