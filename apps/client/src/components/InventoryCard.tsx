import { Item } from 'src/types/item';
import { PictureCard } from './PictureCard';
import rarityColorMap from 'src/utils/rarityColorMap';
import useToggleEquipmentMutation from 'src/hooks/useEquipmentToggleMutation/useEquipmentToggleMutation';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCircleOutline } from '@mdi/js';

const InventoryCard = ({
  item,
  onClick,
}: {
  item: Item;
  onClick: () => void;
}) => {
  const toggleEquipment = useToggleEquipmentMutation();

  return (
    <PictureCard
      className="relative w-full border-opacity-50 hover:border-opacity-100"
      label={item.name}
      publicId={item.picture.publicId}
      color={rarityColorMap[item.rarity]}
      onClick={onClick}
    >
      <button
        className="group/equip absolute left-0 top-0 p-1"
        onClick={(e) => {
          e.stopPropagation();
          if (item.characterInventory?.characterId) {
            toggleEquipment.mutate({
              characterId: item.characterInventory?.characterId,
              inventoryId: item.characterInventoryId,
              category: item.itemTypes,
              itemId: item.id,
            });
          }
        }}
      >
        <Icon
          className="timing text-tertiary group-hover/equip:text-accent"
          path={item.equipped ? mdiCheckCircle : mdiCircleOutline}
          size={1.5}
        />
      </button>
    </PictureCard>
  );
};

export default InventoryCard;
