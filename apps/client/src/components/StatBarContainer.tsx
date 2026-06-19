import { ReactNode } from 'react';

const StatBarContainer = ({
  children,
  className,
  icon = true,
  size = 'small',
}: {
  children: ReactNode;
  className?: string;
  icon?: boolean;
  size?: 'small' | 'large';
}) => {
  return (
    <div
      className={`${className} ${icon ? 'grid-cols-[auto_auto_1fr_auto]' : 'grid-cols-[auto_1fr_auto]'} ${size === 'small' ? 'gap-4' : 'gap-8'} grid h-full w-full grow place-items-start items-center gap-y-3 border-x-2 border-gray-400 border-opacity-50 px-4`}
    >
      {children}
    </div>
  );
};

export default StatBarContainer;
