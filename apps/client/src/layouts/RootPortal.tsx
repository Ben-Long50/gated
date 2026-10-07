import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

const RootPortal = ({
  children,
  close,
}: {
  children: ReactNode;
  close: () => void;
}) => {
  const portalRoot = document.getElementById('portal-root');

  return createPortal(
    <div
      className={`backdrop-fade fixed inset-0 z-30 flex items-center justify-center bg-zinc-300 bg-opacity-80 backdrop-blur-md dark:bg-black dark:bg-opacity-75 sm:p-4 md:p-8`}
      onClick={close}
    >
      {children}
    </div>,
    portalRoot,
  );
};

export default RootPortal;
