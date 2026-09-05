import { mdiChevronDown } from '@mdi/js';
import Icon from '@mdi/react';
import { ReactNode, Ref, useContext, useEffect, useRef, useState } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';

const ItemCardSmall = ({
  cardRef,
  className,
  expanded,
  heading,
  children,
  child = false,
}: {
  cardRef?: Ref;
  className?: string;
  expanded?: boolean;
  heading: ReactNode;
  children?: ReactNode;
  child?: boolean;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const [detailsOpen, setDetailsOpen] = useState(child);
  const [detailHeight, setDetailHeight] = useState(0);

  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailRef.current) {
      setDetailHeight(detailRef.current.offsetHeight);
    }
  }, [detailRef.current, children]);

  return (
    <ThemeContainer
      chamfer="small"
      borderColor={detailsOpen || expanded ? accentPrimary : 'transparent'}
      className={`timing mb-auto w-full`}
      overflowHidden={true}
    >
      <div
        ref={cardRef}
        className={`${className} ${child ? 'bg-secondary' : 'bg-primary'} mb-auto w-full cursor-pointer`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDetailsOpen(!detailsOpen);
        }}
      >
        <summary
          className={`text-primary flex w-full items-center justify-between p-4`}
        >
          {heading}
          {children && (
            <span className={`timing shrink-0 ${detailsOpen && '-rotate-180'}`}>
              <Icon
                path={mdiChevronDown}
                size={1.1}
                className={`text-secondary`}
              ></Icon>
            </span>
          )}
        </summary>
        {children && (
          <div
            className={`${detailsOpen || expanded ? 'max-h-[500px] pb-4' : 'max-h-0 pb-0'} scrollbar-secondary-2 timing flex flex-col gap-4 overflow-y-auto px-4`}
          >
            {children}
          </div>
        )}
      </div>
    </ThemeContainer>
  );
};

export default ItemCardSmall;
