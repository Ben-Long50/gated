import { cloneElement, ReactNode } from 'react';

const IconBtnSmall = ({
  className,
  children,
  active = true,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`${className} ${!active && 'pointer-events-none opacity-50'} bg-secondary hover:border-accent timing shadow-color group rounded border-2 border-transparent p-1 shadow-md`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {cloneElement(children, {
        className:
          'timing text-tertiary group-hover:text-accent group-hover:bg-primary size-8',
      })}
    </button>
  );
};

export default IconBtnSmall;
