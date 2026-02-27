import { ReactNode } from 'react';

const StatBarContainer = ({
  children,
  className,
  size = 'small',
}: {
  children: ReactNode;
  className?: string;
  size?: 'small' | 'large';
}) => {
  return (
    <div
      className={`${className} ${size === 'small' ? 'gap-4' : 'gap-8'} grid h-full w-full grow grid-cols-[auto_auto_1fr_auto] place-items-start items-center gap-y-2`}
    >
      {children}
    </div>
  );
};

export default StatBarContainer;
