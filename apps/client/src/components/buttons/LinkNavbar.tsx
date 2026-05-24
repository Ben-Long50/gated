import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const LinkNavbar = ({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) => {
  const linkStyle =
    'shadow-color rounded border-2 px-4 py-1 group text-center shadow-md timing w-full';

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        isActive
          ? `${linkStyle} text-accent border-accent bg-primary`
          : `${linkStyle} bg-secondary text-primary hover:text-accent border-transparent`
      }
    >
      {children}
    </NavLink>
  );
};

export default LinkNavbar;
