import Icon from '@mdi/react';
import IconBtnSmall from './buttons/IconBtnSmall';
import {
  mdiCheckCircle,
  mdiCircleOutline,
  mdiDotsHorizontal,
  mdiTrashCanOutline,
} from '@mdi/js';
import { useState } from 'react';
import { Item } from 'src/types/item';
import useToggleEquipmentMutation from 'src/hooks/useEquipmentToggleMutation/useEquipmentToggleMutation';
import useDeleteItemMutation from 'src/hooks/useDeleteItemMutation/useDeleteItemMutation';

const InventoryCardMenu = ({ item }: { item: Item }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleEquipment = useToggleEquipmentMutation();
  const deleteItem = useDeleteItemMutation(item.id);

  return (
    <div className="absolute right-1 top-1 flex flex-col items-end justify-start gap-2">
      <IconBtnSmall
        onClick={() => {
          setMenuOpen((prev) => !prev);
        }}
      >
        <Icon path={mdiDotsHorizontal} />
      </IconBtnSmall>
      {menuOpen && (
        <div
          className="fixed inset-0 z-10 bg-transparent"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <ul
        className={`${menuOpen ? 'visible max-h-80' : 'invisible max-h-0'} timing bg-secondary shadow-color z-10 flex min-w-40 list-none flex-col overflow-hidden rounded-md`}
      >
        <li className="group">
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
              setMenuOpen(false);
            }}
          >
            <Icon
              path={item.equipped ? mdiCheckCircle : mdiCircleOutline}
              size={1}
            />{' '}
            {item.equipped ? 'Unequip' : 'Equip'}
          </button>
        </li>
        <li className="group">
          <button
            className="group-hover:text-accent timing flex w-full items-center justify-start gap-2 px-2 py-1"
            onClick={() => {
              deleteItem.mutate();
              setMenuOpen(false);
            }}
          >
            <Icon path={mdiTrashCanOutline} size={1} /> Delete
          </button>
        </li>
      </ul>
    </div>
  );
};

export default InventoryCardMenu;
