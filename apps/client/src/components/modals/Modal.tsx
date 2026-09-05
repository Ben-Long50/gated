import RootPortal from '../../layouts/RootPortal';
import { ReactNode, useContext, useEffect } from 'react';
import { mdiClose } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import Divider from '../Divider';
import useRouteHistoryStore from 'src/stores/routeHistoryStore';
import IconBtnSmall from '../buttons/IconBtnSmall';
import Icon from '@mdi/react';
import { LayoutContext } from 'src/contexts/LayoutContext';

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
  const { mobile } = useContext(LayoutContext);
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
        className="scrollbar-primary-2 bg-base shadow-color relative flex max-h-85dvh w-full max-w-6xl flex-col overflow-y-auto rounded-lg shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <IconBtnSmall
          className="sticky right-2 top-2 z-10 ml-auto"
          tooltip="Close"
          active={true}
          onClick={() => {
            if (backgroundPath) {
              navigate(backgroundPath, { replace: true });
            }
          }}
        >
          <Icon path={mdiClose} />
        </IconBtnSmall>
        <div
          className={`${className} ${mobile ? 'gap-4 p-4' : 'gap-8 p-8'} flex flex-col items-center`}
        >
          {children}
        </div>
        {(button || errors) && (
          <div className="bg-base sticky bottom-0 flex w-full flex-col gap-4 px-4 pb-4 sm:px-8 sm:pb-8">
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
