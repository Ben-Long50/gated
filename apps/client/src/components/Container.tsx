import { ReactNode } from 'react';

const Container = ({ children }: { children: ReactNode }) => {
  const portalRoot = document.getElementById('portal-root');
  console.log(portalRoot);

  return (
    <div className="bg-base shadow-color flex w-full flex-col gap-8 rounded-lg p-4 shadow-lg sm:p-8">
      {children}
    </div>
  );
};

export default Container;
