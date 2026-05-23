import { cloneElement, ReactNode } from 'react';

const IconBtnSmall = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="bg-secondary hover:border-accent timing shadow-color group rounded border-2 border-transparent p-1"
      onClick={onClick}
    >
      {cloneElement(children, {
        className:
          'timing text-tertiary group-hover:text-accent group-hover:bg-primary size-8',
      })}
    </button>
  );
};

export default IconBtnSmall;
