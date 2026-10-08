import { Item } from 'src/types/item';
import { PictureCard } from './PictureCard';
import rarityColorMap from 'src/utils/rarityColorMap';
import Icon from '@mdi/react';
import { mdiCheckCircle } from '@mdi/js';
import InventoryCardMenu from './InventoryCardMenu';
import { ReactNode } from 'react';

const InventoryCard = ({
  item,
  button,
  onClick,
}: {
  item: Item;
  button?: ReactNode;
  onClick: () => void;
}) => {
  return (
    <div className="relative">
      <PictureCard
        className="w-full border-opacity-50 hover:border-opacity-100"
        label={item.name}
        publicId={item.generatedPicture?.publicId}
        color={rarityColorMap[item.rarity]}
        onClick={onClick}
      />
      {item.equipped && (
        <Icon
          className="text-primary bg-primary absolute left-1.5 top-1.5 rounded-full"
          path={mdiCheckCircle}
          size={1}
        />
      )}
      {button ? button : <InventoryCardMenu item={item} />}
    </div>
  );
};

export default InventoryCard;
