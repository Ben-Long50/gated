import { cloneElement, ReactNode } from 'react';

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
      {tooltip && (
        <p className="bg-secondary timing pointer-events-none absolute -top-8 right-1/2 translate-x-1/2 whitespace-nowrap rounded px-1 py-0.5 text-sm opacity-0 shadow shadow-black group-hover:opacity-100">
          {tooltip}
        </p>
      )}
    </button>
  );
};

export default IconBtnMedium;
