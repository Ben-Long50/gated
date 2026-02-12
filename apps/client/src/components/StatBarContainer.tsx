import { ReactNode } from 'react';

const StatBarContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`grid h-full w-full grow grid-cols-[auto_auto_1fr_auto] place-items-start gap-4 gap-y-2`}
    >
      {children}
    </div>
  );
};

export default StatBarContainer;
