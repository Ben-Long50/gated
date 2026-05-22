import { ReactNode } from 'react';

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-base shadow-color relative flex w-full flex-col gap-8 overflow-hidden rounded-lg p-4 shadow-lg sm:p-8">
      {children}
    </div>
  );
};

export default Container;
