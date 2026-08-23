import { Item } from 'src/types/item';
import { PictureCard } from './PictureCard';
import rarityColorMap from 'src/utils/rarityColorMap';
import useToggleEquipmentMutation from 'src/hooks/useEquipmentToggleMutation/useEquipmentToggleMutation';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCircleOutline, mdiDotsHorizontal } from '@mdi/js';
import IconBtnSmall from './buttons/IconBtnSmall';
import InventoryCardMenu from './InventoryCardMenu';

const InventoryCard = ({
  item,
  onClick,
}: {
  item: Item;
  onClick: () => void;
}) => {
  return (
    <div className="relative">
      <PictureCard
        className="w-full border-opacity-50 hover:border-opacity-100"
        label={item.name}
        publicId={item.picture?.publicId}
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
      <InventoryCardMenu item={item} />
    </div>
  );
};

export default InventoryCard;
