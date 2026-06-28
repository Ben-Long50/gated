import { ReactNode } from 'react';

const StatBarContainer = ({
  children,
  size = 'small',
}: {
  children: ReactNode;
  size: 'small' | 'large';
}) => {
  let className = '';

  switch (size) {
    case 'small':
      className = 'gap-4 grid-cols-[auto_1fr_auto] px-2 gap-y-2';
      break;
    case 'large':
      className = 'gap-8 grid-cols-[auto_auto_1fr_auto] px-4 gap-y-3';
      break;
    default:
      break;
  }

  return (
    <div
      className={`${className} grid w-full place-items-start items-center border-x-2 border-gray-400 border-opacity-50`}
    >
      {children}
    </div>
  );
};

export default StatBarContainer;
