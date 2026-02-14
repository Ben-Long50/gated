import RootPortal from '../../layouts/RootPortal';
import { ReactNode, useEffect } from 'react';
import BtnIcon from '../buttons/BtnIcon';
import { mdiClose } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';

const Modal = ({
  children,
  button,
  className,
  path,
}: {
  children: ReactNode;
  button?: ReactNode;
  className?: string;
  path?: string;
}) => {
  const navigate = useNavigate();
  const backgroundPath = useModalStore((state) => state.backgroundPath);

  const setBackgroundPath = useModalStore((state) => state.setBackgroundPath);

  useEffect(() => {
    if (path) {
      setBackgroundPath(path);
    }

    document.documentElement.classList.add('no-scroll');

    return () => {
      document.documentElement.classList.remove('no-scroll');
    };
  }, []);

  return (
    <RootPortal>
      <div className="scrollbar-primary-2 bg-primary shadow-color relative flex max-h-85dvh w-full max-w-5xl flex-col overflow-y-auto rounded-lg shadow-lg">
        <div
          className={`${className} flex flex-col items-center gap-4 p-4 sm:gap-8 sm:p-8`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <BtnIcon
            active={true}
            onClick={() => {
              if (!backgroundPath) {
                navigate(-1);
              } else {
                navigate(backgroundPath, { replace: true });
                navigate(-1);
              }
            }}
            path={mdiClose}
            className="absolute right-2 top-2"
          />
          {children}
        </div>
        {button && (
          <div className="bg-primary sticky bottom-0 w-full p-4 pt-2 sm:p-8 sm:pt-2">
            {button}
          </div>
        )}
      </div>
    </RootPortal>
  );
};

export default Modal;
