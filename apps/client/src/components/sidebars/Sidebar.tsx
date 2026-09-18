import { ReactNode, useContext, useRef } from 'react';
import { LayoutContext } from '../../contexts/LayoutContext';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import Icon from '@mdi/react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useNavigationStore from 'src/stores/navbarStore';
import useTimeout from 'src/hooks/useTimeout';
import IconBtnSmall from '../buttons/IconBtnSmall';

const Sidebar = ({
  children,
  position = 'left',
  open,
  setOpen,
}: {
  children: ReactNode;
  position: 'left' | 'right';
  open?: boolean;
  setOpen?: (state: boolean) => void;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);

  const sidebarRef = useRef<null | HTMLElement>(null);

  const sidebar = useNavigationStore((state) => state.sidebar);
  const setSidebar = useNavigationStore((state) => state.setSidebar);

  const visible = open ?? sidebar;

  const setVisible = (state: boolean) => {
    if (setOpen) {
      setOpen(state);
    } else {
      setSidebar(state);
    }
  };

  const { timer, cancel } = useTimeout(500, () => {
    setVisible(false);
  });

  const sidebarStyle = visible
    ? 'w-full max-w-[378px]'
    : 'min-w-0 max-w-[72px]';

  const mobileSidebarStyle = visible
    ? 'w-full max-w-85dvw'
    : 'w-full max-w-85dvw -translate-x-[105%]';

  const positionStyle = position === 'left' ? 'left-0 pl-2' : 'right-0 pr-2';

  const closeButtonPositionStype = position === 'left' ? 'right-2' : 'left-2';

  return (
    <nav
      ref={sidebarRef}
      className={`${mobile ? mobileSidebarStyle : sidebarStyle} ${positionStyle} timing shadow-color fixed bottom-0 top-0 z-20 overflow-x-hidden py-4`}
      style={{
        borderColor: accentPrimary,
      }}
      onMouseEnter={() => {
        if (!mobile) {
          cancel();
          setVisible(true);
        }
      }}
      onMouseLeave={() => {
        if (!mobile) timer();
      }}
    >
      <div className="scrollbar-secondary bg-base shadow-color shadow-color flex h-full w-full flex-col gap-4 overflow-y-auto overflow-x-hidden rounded-md px-2 py-4">
        {children}
        <IconBtnSmall
          className={`${visible ? 'opacity-100' : 'opacity-0'} ${closeButtonPositionStype} !absolute bottom-6`}
          tooltip="Hide"
          onClick={() => setVisible(false)}
        >
          <Icon path={position === 'left' ? mdiChevronLeft : mdiChevronRight} />
        </IconBtnSmall>
      </div>
    </nav>
  );
};

export default Sidebar;
