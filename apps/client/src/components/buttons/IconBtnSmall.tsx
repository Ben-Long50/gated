import { cloneElement, ReactNode } from 'react';

const IconBtnSmall = ({
  className,
  children,
  active = true,
  tooltip,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  active?: boolean;
  tooltip?: string;
  onClick: () => void;
}) => {
  return (
    <button
      className={`${className} ${!active && 'pointer-events-none opacity-50'} bg-secondary hover:border-accent timing shadow-color group relative size-10 rounded border-2 border-transparent p-1`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {cloneElement(children, {
        className:
          'timing text-tertiary group-hover:text-accent group-hover:bg-primary size-7',
      })}
      {tooltip && (
        <p className="bg-secondary timing pointer-events-none absolute -top-8 right-1/2 translate-x-1/2 whitespace-nowrap rounded px-1 py-0.5 text-sm opacity-0 shadow shadow-black group-hover:opacity-100">
          {tooltip}
        </p>
      )}
    </button>
  );
};

export default IconBtnSmall;
