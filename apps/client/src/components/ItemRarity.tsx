import { mdiStar } from '@mdi/js';
import Icon from '@mdi/react';

const ItemRarity = ({
  rarity,
  grade,
  className,
  size = 'small',
}: {
  rarity: string;
  grade: number;
  className?: string;
  size: 'small' | 'large';
}) => {
  return (
    <div
      className={`${className} ${size === 'small' ? 'gap-x-2' : 'gap-x-4'} flex items-center justify-start`}
    >
      {rarity === 'common' ? (
        <h5 className="text-2xl font-semibold italic tracking-wide text-gray-400">
          {size === 'small' ? 'C' : 'Common'}
        </h5>
      ) : rarity === 'uncommon' ? (
        <h5 className="text-shadow break-words text-2xl font-semibold italic tracking-wider text-green-500 text-shadow-blur-1 text-shadow-x-1 text-shadow-y-1 text-shadow-green-700">
          {size === 'small' ? 'U' : 'Uncommon'}
        </h5>
      ) : rarity === 'rare' ? (
        <h5 className="text-shadow font-zen text-2xl font-semibold italic tracking-widest text-red-600 text-shadow-blur-1 text-shadow-x-1 text-shadow-y-1 text-shadow-red-900">
          {size === 'small' ? 'R' : 'Rare'}
        </h5>
      ) : rarity === 'blackMarket' ? (
        <h5 className="text-shadow text-wrap text-right font-logo text-2xl font-semibold tracking-widest text-purple-700 text-shadow-blur-1 text-shadow-x-1 text-shadow-y-1 text-shadow-purple-900">
          {size === 'small' ? 'B' : 'Black Market'}
        </h5>
      ) : rarity === 'artifact' ? (
        <h5 className="text-shadow font-kings text-3xl font-semibold tracking-widest text-amber-400 text-shadow-blur-1 text-shadow-x-1 text-shadow-y-1 text-shadow-amber-700">
          {size === 'small' ? 'A' : 'Artifact'}
        </h5>
      ) : (
        <h5 className="text-2xl font-semibold text-gray-500">Unknown</h5>
      )}
      {grade > 5 ? (
        <div className="flex items-center gap-2">
          <Icon
            path={mdiStar}
            className="size-6 shrink-0 stroke-zinc-950 text-yellow-400"
          />
          <p className="whitespace-nowrap pt-1 font-semibold">x {grade}</p>
        </div>
      ) : (
        <div className="flex">
          {Array.from({ length: grade }).map((_, index) => (
            <Icon
              key={index}
              path={mdiStar}
              className="size-6 stroke-zinc-950 text-yellow-400"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemRarity;
