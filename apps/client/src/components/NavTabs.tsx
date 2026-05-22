import { ReactNode } from 'react';

const NavTabs = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`${className} grid w-full grid-flow-col items-center gap-4`}
    >
      {children}
    </div>
  );
};

export default NavTabs;
