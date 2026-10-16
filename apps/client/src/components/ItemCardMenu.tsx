import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCircleOutline, mdiTrashCanOutline } from '@mdi/js';
import { Item } from '@gated/shared';
import useToggleEquipmentMutation from 'src/hooks/useEquipmentToggleMutation/useEquipmentToggleMutation';
import useDeleteItemMutation from 'src/hooks/useDeleteItemMutation/useDeleteItemMutation';
import Menu from './characterComponents/Menu';

const InventoryCardMenu = ({ item }: { item: Item }) => {
  const toggleEquipment = useToggleEquipmentMutation();
  const deleteItem = useDeleteItemMutation(item.id);

  return (
    <Menu>
      <button
        className="group-hover:text-accent timing flex w-full items-center justify-start gap-2 px-2 py-1"
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
        <Icon
          path={item.equipped ? mdiCheckCircle : mdiCircleOutline}
          size={1}
        />{' '}
        {item.equipped ? 'Unequip' : 'Equip'}
      </button>
      <button
        className="group-hover:text-accent timing flex w-full items-center justify-start gap-2 px-2 py-1"
        onClick={() => {
          deleteItem.mutate();
        }}
      >
        <Icon path={mdiTrashCanOutline} size={1} /> Delete
      </button>
    </Menu>
  );
};

export default InventoryCardMenu;
