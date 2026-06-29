import { ReactNode, useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const NavTabs = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <div
      className={`${className} ${mobile ? 'grid-flow-row grid-cols-2' : 'grid-flow-col'} grid w-full items-center gap-4`}
    >
      {children}
    </div>
  );
};

export default NavTabs;
