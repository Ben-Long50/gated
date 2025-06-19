import Icon from '@mdi/react';
import { ReactNode } from 'react';
import Loading from '../Loading';

const BtnIcon = ({
  path,
  active,
  onClick,
  className,
  loading,
  children,
}: {
  path: string;
  active: boolean;
  onClick: () => void;
  className?: string;
  loading?: boolean;
  children?: ReactNode;
}) => {
  return (
    <button
      className={`${className} ${active ? 'hover:text-accent' : 'opacity-30'} bg-tertiary text-secondary timing shadow-color shrink-0 rounded-md p-1.5 text-center font-semibold shadow-md`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) {
          onClick();
        }
      }}
    >
      {!loading ? (
        <Icon path={path} className="size-6 text-inherit" />
      ) : (
        <Loading size={1} />
      )}
      {children}
    </button>
  );
};

export default BtnIcon;
