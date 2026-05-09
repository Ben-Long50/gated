import RootPortal from '../../layouts/RootPortal';
import { ReactNode, useEffect } from 'react';
import BtnIcon from '../buttons/BtnIcon';
import { mdiClose } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import Divider from '../Divider';
import useRouteHistoryStore from 'src/stores/routeHistoryStore';

const Modal = ({
  children,
  button,
  errors,
  className,
}: {
  children: ReactNode;
  button?: ReactNode;
  errors?: ReactNode;
  className?: string;
}) => {
  const navigate = useNavigate();
  const backgroundPath = useModalStore((state) => state.backgroundPath);

  const getLastRoute = useRouteHistoryStore((state) => state.getLastRoute);

  const setBackgroundPath = useModalStore((state) => state.setBackgroundPath);

  useEffect(() => {
    const lastRoute = getLastRoute();

    setBackgroundPath(lastRoute);

    document.documentElement.classList.add('no-scroll');

    return () => {
      document.documentElement.classList.remove('no-scroll');
    };
  }, []);

  return (
    <RootPortal>
      <div
        className="scrollbar-primary-2 bg-primary shadow-color relative flex max-h-85dvh w-full max-w-5xl flex-col overflow-y-auto rounded-lg shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={`${className} flex flex-col items-center gap-4 p-8 pb-4`}
        >
          <BtnIcon
            active={true}
            onClick={() => {
              if (backgroundPath) {
                navigate(backgroundPath, { replace: true });
              }
            }}
            path={mdiClose}
            className="absolute right-2 top-2"
          />
          {children}
        </div>
        {(button || errors) && (
          <div className="bg-primary sticky bottom-0 flex w-full flex-col gap-4 px-4 pb-4 sm:px-8 sm:pb-8">
            <Divider />
            {errors}
            {button}
          </div>
        )}
      </div>
    </RootPortal>
  );
};

export default Modal;
