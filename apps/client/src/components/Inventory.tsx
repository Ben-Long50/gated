import BtnAuth from './buttons/BtnAuth';
import Divider from './Divider';
import ArmorIcon from './icons/ArmorIcon';
import CyberIcon from './icons/CyberIcon';
import DroneIcon from './icons/DroneIcon';
import InventoryIcon from './icons/InventoryIcon';
import PotionIcon from './icons/PotionIcon';
import VehicleIcon from './icons/VehicleIcon';
import WeaponIcon from './icons/WeaponIcon';
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCheckCircle } from '@mdi/js';
import useToggleEquipmentMutation from 'src/hooks/useEquipmentToggleMutation/useEquipmentToggleMutation';
import rarityColorMap from 'src/utils/rarityColorMap';
import useCharacter from 'src/hooks/useCharacter';
import Loading from './Loading';
import { Item } from 'src/types/item';
import { useRef } from 'react';
import NavTabs from './NavTabs';
import CharacterHeader from './CharacterHeader';

const Inventory = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const { filteredCharacter: character, isLoading } = useCharacter(
    Number(characterId),
  );

  const category = searchParams.get('category');

  const items = category
    ? character?.inventory.filter((item) => item.itemTypes.includes(category))
    : character?.inventory;

  const toggleEquipment = useToggleEquipmentMutation();

  const handleTab = (newCategory: string | null) => {
    if (!newCategory) {
      navigate('');
    } else {
      navigate(`?category=${newCategory}`);
    }
  };

  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (item: Item) => {
    clickTimeout.current = setTimeout(() => {
      navigate(`items/${item.id}`);
    }, 200);
  };

  const handleDoubleClick = (item: Item) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }

    if (character) {
      toggleEquipment.mutate({
        characterId: character?.id,
        inventoryId: character?.characterInventory.id,
        category: item.itemTypes,
        itemId: item.id,
      });
    }
  };

  return (
    <>
      <CharacterHeader character={character} />
      <NavTabs>
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
          active={category === 'cybernetic'}
          onClick={() => handleTab('cybernetic')}
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
      </NavTabs>
      <Divider className="col-span-2 opacity-50" />
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
                onDoubleClick={(e) => {
                  e.preventDefault();
                  handleDoubleClick(item);
                }}
                // onClick={(e) => {
                //   e.preventDefault();
                //   handleClick(item);
                // }}
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
      <Outlet context={{ parts }} />
    </>
  );
};

export default Inventory;
