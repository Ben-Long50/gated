import { ReactNode } from 'react';

const NavTabs = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-primary shadow-color grid w-full grid-flow-col items-center gap-4 rounded-md p-4 sm:p-6">
      {children}
    </div>
  );
};

export default NavTabs;
