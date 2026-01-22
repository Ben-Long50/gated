import useItems from 'src/hooks/useItems';
import BtnAuth from './buttons/BtnAuth';
import Divider from './Divider';
import ArmorIcon from './icons/ArmorIcon';
import CyberIcon from './icons/CyberIcon';
import DroneIcon from './icons/DroneIcon';
import InventoryIcon from './icons/InventoryIcon';
import PotionIcon from './icons/PotionIcon';
import VehicleIcon from './icons/VehicleIcon';
import WeaponIcon from './icons/WeaponIcon';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCheckCircle } from '@mdi/js';
import useToggleEquipmentMutation from 'src/hooks/useEquipmentToggleMutation/useEquipmentToggleMutation';
import rarityColorMap from 'src/utils/rarityColorMap';
import useCharacter from 'src/hooks/useCharacter';
import Loading from './Loading';

const Inventory = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    filteredCharacter: character,
    itemIds,
    isLoading,
  } = useCharacter(Number(characterId));

  const category = searchParams.get('category');

  const { items } = useItems(itemIds, category);

  const toggleEquipment = useToggleEquipmentMutation();

  const handleTab = (newCategory: string | null) => {
    if (!newCategory) {
      navigate('');
    } else {
      navigate(`?category=${newCategory}`);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="text-center">Inventory</h1>
      <div className="grid h-full grow grid-flow-col gap-2 sm:gap-4">
        <BtnAuth active={!category} onClick={() => handleTab(null)}>
          All
        </BtnAuth>
        <BtnAuth
          active={category === 'weapon'}
          onClick={() => handleTab('weapon')}
        >
          <WeaponIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={category === 'armor'}
          onClick={() => handleTab('armor')}
        >
          <ArmorIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={category === 'augmentation'}
          onClick={() => handleTab('augmentation')}
        >
          <CyberIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={category === 'reusable'}
          onClick={() => handleTab('reusable')}
        >
          <InventoryIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={category === 'consumable'}
          onClick={() => handleTab('consumable')}
        >
          <PotionIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={category === 'vehicle'}
          onClick={() => handleTab('vehicle')}
        >
          <VehicleIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={category === 'drone'}
          onClick={() => handleTab('drone')}
        >
          <DroneIcon className="size-8" />
        </BtnAuth>
      </div>
      <Divider className="col-span-2" />
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={`scrollbar-secondary-2 grid grid-cols-6 gap-2 sm:gap-4`}
        >
          {items ? (
            items.map((item, index) => (
              <div
                className="group relative h-full cursor-pointer select-none overflow-hidden rounded-bl rounded-tr pl-1 clip-4"
                style={{ backgroundColor: rarityColorMap[item.rarity] }}
                key={index}
                onDoubleClick={() => {
                  if (character) {
                    toggleEquipment.mutate({
                      characterId: character?.id,
                      inventoryId: character?.characterInventory.id,
                      category: item.itemTypes,
                      itemId: item.id,
                    });
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  navigate(`../../inventory/items/${item.id}`);
                }}
              >
                {item.equipped === true && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950 bg-opacity-65">
                    <Icon
                      className="text-tertiary group-hover:text-secondary h-full"
                      path={mdiCheckCircle}
                      size={3}
                    />
                  </div>
                )}
                {item.picture?.imageUrl ? (
                  <img
                    className="aspect-square size-full"
                    src={item.picture?.imageUrl}
                    alt={item.name}
                  />
                ) : (
                  <div className="bg-tertiary aspect-square h-full p-1 hover:opacity-80">
                    <p className="my-auto text-center text-base">{item.name}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <h2 className="pl-4">???</h2>
          )}
        </div>
      )}
      <p className="text-tertiary text-right">
        (Double click to equip / unequip)
      </p>
    </div>
  );
};

export default Inventory;
