import Icon from '@mdi/react';
import IconBtnSmall from '../buttons/IconBtnSmall';
import { mdiDotsHorizontal } from '@mdi/js';
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  useState,
} from 'react';

const Menu = ({ children }: { children: ReactElement }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="absolute right-1 top-1 z-10 flex flex-col items-end justify-start gap-2">
      <IconBtnSmall
        onClick={() => {
          setMenuOpen((prev) => !prev);
        }}
        tooltip="Character Menu"
      >
        <Icon path={mdiDotsHorizontal} />
      </IconBtnSmall>
      {menuOpen && (
        <div
          className="fixed inset-0 z-10 bg-transparent"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`${menuOpen ? 'visible max-h-80' : 'invisible max-h-0'} timing bg-primary shadow-color z-10 flex min-w-40 list-none flex-col gap-2 overflow-hidden rounded-md p-2`}
        onClick={() => setMenuOpen(false)}
      >
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;

          return cloneElement(child, {
            className:
              'hover:shadow-color hover:text-accent text-secondary timing hover:bg-secondary flex w-full items-center justify-start gap-2 rounded p-1.5',
          });
        })}
      </div>
    </div>
  );
};

export default Menu;
