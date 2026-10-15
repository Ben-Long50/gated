import { ReactNode, useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const Container = ({ children }: { children: ReactNode }) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <div
      className={`${mobile ? 'gap-6 p-4' : 'gap-8 rounded-lg p-8'} bg-base shadow-color relative flex w-full flex-col shadow-lg`}
    >
      {children}
    </div>
  );
};

export default Container;
