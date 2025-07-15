import { ReactNode, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useNavigationStore from 'src/stores/navbarStore';

const NavTabs = ({ children }: { children: ReactNode }) => {
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);
  const location = useLocation();
  const parts = location.pathname.split('/');

  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  return (
    <div
      className="bg-primary shadow-color sticky z-10 grid w-full grid-cols-2 items-center gap-8 rounded-lg p-4 shadow-md"
      style={{
        top: !parts.includes('maps')
          ? mobile
            ? `${navbarHeight + 16}px`
            : `${navbarHeight + 32}px`
          : 0,
      }}
    >
      {children}
    </div>
  );
};

export default NavTabs;
