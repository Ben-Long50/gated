import { useContext, useRef } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { capitalCase } from 'change-case';
import BtnIcon from './buttons/BtnIcon';
import { mdiSync } from '@mdi/js';
import Divider from './Divider';
import IconBtnSmall from './buttons/IconBtnSmall';
import Icon from '@mdi/react';

const AccountPreferences = () => {
  const { accentPrimary, changeTheme, theme, changeAccent } =
    useContext(ThemeContext);

  const accentRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <p>Theme</p>
        <div className="flex items-center gap-4">
          <p>{capitalCase(theme)}</p>
          <IconBtnSmall onClick={() => changeTheme()}>
            <Icon path={mdiSync} />
          </IconBtnSmall>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <p>Theme Color</p>
        <div className="flex items-center gap-4">
          <p>{accentPrimary}</p>
          <label
            className="shadow-color size-10 cursor-pointer rounded-full shadow-md"
            style={{ backgroundColor: accentPrimary }}
            htmlFor="accentPicker"
            onClick={() => accentRef.current?.focus()}
          >
            <input
              ref={accentRef}
              className="size-0"
              id="accentPicker"
              name="accentPicker"
              type="color"
              value={accentPrimary}
              onChange={(e) => changeAccent(e.target.value)}
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default AccountPreferences;
