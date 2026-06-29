import Icon from '@mdi/react';
import { mdiCollapseAllOutline, mdiExpandAllOutline } from '@mdi/js';
import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from 'react';
import ArrowHeader2 from './ArrowHeader2';
import IconBtnSmall from './buttons/IconBtnSmall';

const ExpandingList = ({
  title,
  children,
  className,
  onClick,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const [listExpanded, setListExpanded] = useState(false);

  const childCount = Children.count(children);

  return (
    <div className={`flex w-full flex-col gap-8`}>
      <div className="flex w-full items-center justify-between gap-8">
        <ArrowHeader2 title={title} />
        <IconBtnSmall
          onClick={() => {
            if (onClick) {
              onClick();
            }
            setListExpanded((prev) => !prev);
          }}
        >
          {listExpanded ? (
            <Icon
              path={mdiCollapseAllOutline}
              className="text-secondary timing group-hover:text-accent"
            />
          ) : (
            <Icon
              path={mdiExpandAllOutline}
              className="text-secondary timing group-hover:text-accent"
            />
          )}
        </IconBtnSmall>
      </div>
      {childCount > 0 && (
        <div className={`${className}`}>
          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child, {
                expanded: listExpanded,
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export default ExpandingList;
