import useItemQuery from 'src/hooks/useItemQuery/useItemQuery';
import CharacterPictureRound from '../CharacterPictureRound';
import ItemCardSmall from '../ItemCardSmall';
import ArrowHeader3 from '../ArrowHeader3';
import StatBars from '../StatBars';
import { ReactNode } from 'react';
import Loading from '../Loading';

const ItemCardExpanding = ({
  itemId,
  children,
  expanded,
}: {
  itemId: number;
  children?: ReactNode;
  expanded?: boolean;
}) => {
  const { data: item, isLoading } = useItemQuery(itemId);

  if (isLoading || !item) {
    return <Loading size={1.15} />;
  }

  return (
    <ItemCardSmall
      expanded={expanded}
      className="col-span-2"
      heading={
        <div className="mr-2 flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <CharacterPictureRound className="-my-2 size-10" character={item} />
            <ArrowHeader3 title={item.name} />
          </div>
          {children}
        </div>
      }
    >
      <div
        className={`scrollbar-primary-2 grid w-full grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-2 overflow-y-auto border-x-2 border-gray-400 border-opacity-50 px-4`}
      >
        <StatBars stats={item.stats} cardWidth={501} />
      </div>
    </ItemCardSmall>
  );
};

export default ItemCardExpanding;
