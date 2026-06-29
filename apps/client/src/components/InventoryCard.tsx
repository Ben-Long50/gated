import { Item } from 'src/types/item';
import { PictureCard } from './PictureCard';
import rarityColorMap from 'src/utils/rarityColorMap';
import useToggleEquipmentMutation from 'src/hooks/useEquipmentToggleMutation/useEquipmentToggleMutation';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCircleOutline } from '@mdi/js';
import IconBtnSmall from './buttons/IconBtnSmall';

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
      <IconBtnSmall
        className="absolute left-1 top-1"
        onClick={() => {
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
        <Icon path={item.equipped ? mdiCheckCircle : mdiCircleOutline} />
      </IconBtnSmall>
    </PictureCard>
  );
};

export default InventoryCard;
