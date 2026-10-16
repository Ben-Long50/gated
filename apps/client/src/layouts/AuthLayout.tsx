import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import LogoTitle from '../components/LogoTitle';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';

const AuthLayout = () => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <>
      <div
        className={`scrollbar-primary-2 relative grid h-full min-h-dvh w-dvw place-items-center overflow-y-auto`}
        style={
          {
            '--accent-primary': accentPrimary,
          } as React.CSSProperties
        }
      >
        <LogoTitle
          className={`${mobile ? 'bottom-4 left-4' : 'bottom-8 left-8'} absolute`}
        />
        <Outlet />
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
    </>
  );
};

export default AuthLayout;
