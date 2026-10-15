import { mdiTriangleDown } from '@mdi/js';
import Icon from '@mdi/react';
import { CSSProperties, useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const ArrowHeader4 = ({
  title,
  className,
  style,
  reverse,
}: {
  title: string;
  className?: string;
  style?: CSSProperties;
  reverse?: boolean;
}) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <div
      className={`${className} text-left ${reverse && 'flex-row-reverse'} flex items-start gap-2.5`}
    >
      <Icon
        className={`${mobile ? 'mt-[7px]' : 'mt-[9px]'} shrink-0 !text-inherit`}
        path={mdiTriangleDown}
        size={0.375}
        rotate={reverse ? 90 : -90}
      />
      <h4 className="truncate !text-inherit">{title}</h4>
    </div>
  );
};

export default ArrowHeader4;
