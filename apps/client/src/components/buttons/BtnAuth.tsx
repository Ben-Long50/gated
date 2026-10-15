import { ReactNode, useContext, useState } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from '../../contexts/ThemeContext';

const BtnAuth = ({
  onClick,
  children,
  className,
  active,
}: {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  active?: boolean;
}) => {
  const [borderColor, setBorderColor] = useState('transparent');
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <ThemeContainer
      borderColor={active ? accentPrimary : borderColor}
      className={`${className}`}
      chamfer="small"
    >
      <button
        className={`${active ? 'bg-primary text-accent' : 'bg-secondary text-secondary'} hover:bg-primary hover:text-accent timing mx-auto flex w-full items-center justify-center rounded-bl rounded-tr px-4 py-2 text-lg clip-4`}
        onClick={
          onClick
            ? (e) => {
                e.preventDefault();
                onClick();
              }
            : undefined
        }
        onMouseEnter={() => {
          setBorderColor(accentPrimary);
        }}
        onMouseLeave={() => {
          setBorderColor('transparent');
        }}
      >
        {children}
      </button>
    </ThemeContainer>
  );
};
export default BtnAuth;
