import RootPortal from '../../layouts/RootPortal';
import { useContext, useEffect } from 'react';
import { mdiClose } from '@mdi/js';
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import useRouteHistoryStore from 'src/stores/routeHistoryStore';
import IconBtnSmall from '../buttons/IconBtnSmall';
import Icon from '@mdi/react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const Modal = ({ className }: { className?: string }) => {
  const { mobile } = useContext(LayoutContext);
  const location = useLocation();
  const navigate = useNavigate();

  const setBackgroundData = useRouteHistoryStore(
    (state) => state.setBackgroundData,
  );
  const resetBackgroundData = useRouteHistoryStore(
    (state) => state.resetBackgroundData,
  );
  const getRouteDelta = useRouteHistoryStore((state) => state.getRouteDelta);

  useEffect(() => {
    setBackgroundData();
  }, []);

  const close = () => {
    const delta = getRouteDelta({
      path: location.pathname + location.search,
      key: location.key,
    });

    resetBackgroundData();

    navigate(delta);
  };

  const context = useOutletContext();

  useEffect(() => {
    document.documentElement.classList.add('no-scroll');

    return () => {
      document.documentElement.classList.remove('no-scroll');
    };
  }, []);

  return (
    <RootPortal close={close}>
      <div
        className="scrollbar-primary-2 bg-base shadow-color relative flex max-h-85dvh w-full max-w-6xl flex-col overflow-y-auto overflow-x-hidden rounded-lg shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <IconBtnSmall
          className="sticky right-2 top-2 z-10 ml-auto"
          tooltip="Close"
          active={true}
          onClick={close}
        >
          <Icon path={mdiClose} />
        </IconBtnSmall>
        <div
          className={`${className} ${mobile ? 'gap-4 p-4' : 'gap-8 p-8'} flex flex-col`}
        >
          <Outlet context={context} />
        </div>
      </div>
    </RootPortal>
  );
};

export default Modal;
