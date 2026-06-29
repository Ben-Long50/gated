import { ReactNode, useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const InventoryGrid = ({
  minWidth,
  children,
}: {
  minWidth: number;
  children: ReactNode;
}) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <div
      className={`${mobile ? 'gap-4' : 'gap-6'} grid w-full`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

export default InventoryGrid;
