import { ReactNode, useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import IconBtnSmall from './buttons/IconBtnSmall';
import { mdiMinus, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';

const StatBar = ({
  title,
  total,
  current,
  reserve,
  color,
  mode,
  children,
  mutation,
  handleChange,
  cardWidth,
  size,
  widthCap = true,
}: {
  title?: string;
  total?: number;
  reserve?: number;
  current: number;
  color: string;
  mode?: string;
  children: ReactNode;
  mutation?: (value: number) => void;
  handleChange?: (value: number) => void;
  cardWidth: number;
  size?: 'large' | 'small';
  widthCap?: boolean;
}) => {
  const { theme } = useContext(ThemeContext);
  const small = cardWidth < 500;

  const arrayLength = (() => {
    let divider = 1;
    if (current > 50 && current <= 100) {
      divider = 2;
    } else if (current > 100 && current <= 150) {
      divider = 3;
    } else if (current > 150 && current <= 250) {
      divider = 4;
    } else if (current > 250) {
      divider = 5;
    }
    if (total) {
      return total > current
        ? Math.floor(divider ? total / divider : total)
        : Math.floor(divider ? current / divider : current);
    } else {
      return Math.floor(divider ? current / divider : current);
    }
  })();

  return (
    <>
      {title && (small ? null : <h4>{title}</h4>)}
      {children}
      <div className={`flex w-full items-center rounded`} style={{}}>
        {Array.from({
          length: arrayLength,
        }).map((_, index) => (
          <div
            key={index}
            className={`${widthCap && 'max-w-8'} ${index === 0 && 'rounded-l-sm border-l-[1px]'} ${index === arrayLength - 1 && 'rounded-r-sm border-r-[1px]'} ${total && index >= total && 'ring-[3px] ring-inset ring-red-600'} ${size === 'small' ? 'h-3.5' : 'h-4'} w-full min-w-[1px] grow border-b-[1px] border-l-[0.5px] border-r-[0.5px] border-t-[1px] border-zinc-700 dark:border-black`}
            style={{
              backgroundImage:
                index < current
                  ? `linear-gradient(to bottom, rgb(160, 160, 160), ${color}, rgb(50, 50, 50)`
                  : 'none',
              backgroundColor:
                index < current
                  ? undefined
                  : theme === 'light'
                    ? 'rgb(161 161 170)'
                    : 'gray',
            }}
          />
        ))}
      </div>
      {mode !== 'edit' && (
        <div className="flex items-center justify-end gap-4 place-self-end">
          <div
            className={`${small ? 'gap-1' : 'gap-2'} text-tertiary flex w-full items-center justify-end whitespace-nowrap text-xl`}
          >
            <div
              className={`${mutation && 'hover:text-accent cursor-pointer'} text-secondary grid h-6 min-w-6 select-none place-content-center`}
              onClick={(e) => {
                e.stopPropagation();
                if (mutation) mutation(-1);
              }}
            >
              <p
                className={`${total && current > total ? 'text-error' : '!text-inherit'} ${size === 'small' && '!text-base'} `}
              >
                {current}
              </p>
            </div>
            {(reserve || total) && (
              <>
                <p>/</p>
                <div
                  className={`${mutation && 'hover:text-accent cursor-pointer'} text-secondary grid h-6 min-w-6 select-none place-content-center`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mutation) mutation(1);
                  }}
                >
                  <p
                    className={`${size === 'small' && '!text-base'} !text-inherit`}
                  >
                    {reserve !== undefined ? reserve : total}
                  </p>
                </div>
              </>
            )}
          </div>
          {handleChange && (
            <>
              <IconBtnSmall onClick={() => handleChange(-1)}>
                <Icon path={mdiMinus} />
              </IconBtnSmall>
              <IconBtnSmall onClick={() => handleChange(1)}>
                <Icon path={mdiPlus} />
              </IconBtnSmall>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default StatBar;
