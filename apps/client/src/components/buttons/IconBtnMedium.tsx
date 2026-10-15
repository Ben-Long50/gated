import { cloneElement, ReactNode } from 'react';
import Tooltip from '../Tooltip';

const IconBtnMedium = ({
  className,
  children,
  active = false,
  tooltip,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  active?: boolean;
  tooltip: string;
  onClick: () => void;
}) => {
  return (
    <button
      className={`${className} group relative ${active ? 'border-accent' : 'border-transparent'} bg-secondary hover:border-accent timing shadow-color group rounded border-2 p-1.5 shadow-md`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {cloneElement(children, {
        className:
          'timing text-tertiary  group-hover:text-accent group-hover:bg-primary size-9',
      })}
      {tooltip && <Tooltip label={tooltip} />}
    </button>
  );
};

export default IconBtnMedium;
