import { ReactNode, useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';

const BtnControl = ({
  title,
  icon,
  mutation,
}: {
  title: string;
  icon: ReactNode;
  mutation?: (() => void) | null;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <button
      className={`${mutation === null ? 'border-gray-400 opacity-50' : 'hover:bg-tertiary hover:text-accent border-opacity-50 hover:border-opacity-100'} bg-primary text-secondary timing shadow-color grid w-full shrink-0 items-center justify-center gap-4 rounded-md border px-2 py-2 shadow-md`}
      style={{ borderColor: accentPrimary }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mutation) {
          mutation();
        }
      }}
    >
      <div className="mx-auto grid grid-cols-[1fr_4fr]">
        <div className="shrink-0">{icon}</div>
        <p className="timing !text-inherit">{title}</p>
      </div>
    </button>
  );
};

export default BtnControl;
