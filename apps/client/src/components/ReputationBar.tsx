import { mdiTriangleDown } from '@mdi/js';
import Icon from '@mdi/react';

const ReputationBar = ({
  value,
  className,
}: {
  value: number;
  className?: string;
  onClick?: (value: number) => void;
}) => {
  const reputationValue = value;

  const handleButtonColor = (buttonValue: number) => {
    if (reputationValue > buttonValue) {
      return 'transparent';
    } else if (reputationValue <= buttonValue) {
      return 'bg-zinc-500';
    }

    return;
  };

  return (
    <div className={`${className} flex w-full flex-col`}>
      <div className="flex items-center justify-between">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`flex h-8 w-0 items-center justify-center rounded-lg text-center text-base font-semibold`}
          >
            <p
              className={`${reputationValue === index + 1 && 'text-accent !text-3xl'} timing text-base font-bold`}
            >
              {index + 1}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full">
        <div className="my-4 grid h-5 w-full grid-cols-4 rounded bg-gradient-to-r from-blue-600 via-yellow-300 to-red-500">
          {Array.from({ length: 4 }).map((_, index) => {
            const buttonValue = index + 1;

            const buttonClassName = handleButtonColor(buttonValue);

            const showMarker =
              (reputationValue === 5 && buttonValue === 4) ||
              reputationValue === buttonValue;

            return (
              <div
                key={index}
                className={`${buttonClassName} ${buttonValue === 4 && 'rounded-r'} ${buttonValue === 0 && 'rounded-l'} timing relative w-full`}
              >
                {showMarker && (
                  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-2 opacity-100">
                    <Icon
                      className="text-accent"
                      path={mdiTriangleDown}
                      size={0.75}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReputationBar;
