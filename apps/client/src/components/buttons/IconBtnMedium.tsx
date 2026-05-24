import { cloneElement, ReactNode } from 'react';

const IconBtnMedium = ({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className={`${className} bg-secondary hover:border-accent timing shadow-color group rounded border-2 border-transparent p-1.5 shadow-md`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {cloneElement(children, {
        className:
          'timing text-tertiary group-hover:text-accent group-hover:bg-primary size-9',
      })}
    </button>
  );
};

export default IconBtnMedium;
