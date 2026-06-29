import { Outlet } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useContext } from 'react';
import LogoTitle from '../components/LogoTitle';
import { LayoutContext } from 'src/contexts/LayoutContext';

const AuthLayout = () => {
  const { theme } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);

  return (
    <div
      className={`${theme} scrollbar-primary-2 relative flex h-full min-h-dvh w-dvw items-center justify-center overflow-y-auto`}
    >
      <LogoTitle
        className={`${mobile ? 'bottom-4 left-4' : 'bottom-8 left-8'} absolute`}
      />
      <div className="z-20 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
