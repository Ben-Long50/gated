import { useContext, useRef } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { capitalCase } from 'change-case';
import { mdiSync } from '@mdi/js';
import IconBtnSmall from './buttons/IconBtnSmall';
import Icon from '@mdi/react';
import Page from './Page';

const AccountPreferences = () => {
  const { accentPrimary, changeTheme, theme, changeAccent } =
    useContext(ThemeContext);

  const accentRef = useRef<HTMLInputElement | null>(null);

  return (
    <Page title="Account Preferences">
      <div className="flex w-full items-center justify-between">
        <p>Theme</p>
        <div className="flex items-center gap-4">
          <p>{capitalCase(theme)}</p>
          <IconBtnSmall onClick={() => changeTheme()} tooltip="Toggle Theme">
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
    </Page>
  );
};

export default AccountPreferences;
