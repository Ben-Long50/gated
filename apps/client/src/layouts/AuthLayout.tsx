import { Outlet } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useContext } from 'react';
import LogoTitle from '../components/LogoTitle';

const AuthLayout = () => {
  const { theme, accentPrimary } = useContext(ThemeContext);

  return (
    <div
      className={`${theme} scrollbar-primary-2 relative flex h-full min-h-dvh w-dvw items-center justify-center overflow-y-auto p-4 sm:p-8`}
      style={{
        '--accent-primary': accentPrimary as React.CSSProperties,
        backgroundImage: `url('/nova_viridian.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <LogoTitle className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8" />
      <div className="z-20">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
