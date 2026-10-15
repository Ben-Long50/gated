import { User } from 'src/types/user';
import CharacterIcon from './icons/CharacterIcon';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Tooltip from './Tooltip';

const AccountPicture = ({
  user,
  className,
  tooltip = true,
}: {
  user: User | null;
  className?: string;
  tooltip?: boolean;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  return user ? (
    <div
      className={`${className} shadow-color group relative flex size-10 shrink-0 items-center justify-center rounded-full shadow-md`}
      style={{ backgroundColor: accentPrimary }}
    >
      {user?.profilePicture ? (
        <img
          key={user.id}
          className={`${className} shadow-color size-full shrink-0 rounded-full shadow-md`}
          src={user.profilePicture}
          alt="Profile"
        />
      ) : (
        <p className="pt-1 text-2xl font-semibold !text-zinc-900">
          {user.username[0].toUpperCase()}
        </p>
      )}
      {tooltip && <Tooltip label={user.username} />}
    </div>
  ) : (
    <CharacterIcon className="text-secondary shadow-color size-10 shadow-md" />
  );
};

export default AccountPicture;
