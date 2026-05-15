import { ReactNode } from 'react';

const NavTabs = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid w-full grid-flow-col items-center gap-4">
      {children}
    </div>
  );
};

export default NavTabs;
