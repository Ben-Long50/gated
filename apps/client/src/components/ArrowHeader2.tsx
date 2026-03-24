import { mdiTriangleDown } from '@mdi/js';
import Icon from '@mdi/react';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const ArrowHeader2 = ({
  title,
  className,
  reverse,
}: {
  title: string;
  className?: string;
  reverse?: boolean;
}) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <div
      className={`${className} text-primary text-left ${reverse && 'flex-row-reverse'} flex items-start gap-4`}
    >
      <Icon
        className={`${mobile ? 'mt-[9px]' : 'mt-[11px]'} shrink-0 !text-inherit`}
        path={mdiTriangleDown}
        size={0.5}
        rotate={reverse ? 90 : -90}
      />
      <h2 className="!text-inherit">{title}</h2>
    </div>
  );
};

export default ArrowHeader2;
