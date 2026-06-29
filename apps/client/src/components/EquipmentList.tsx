import BtnAuth from './buttons/BtnAuth';
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
  useSearchParams,
} from 'react-router-dom';
import { Equipment, Item } from 'src/types/item';
import { useRef } from 'react';
import NavTabs from './NavTabs';
import InventoryCard from './InventoryCard';
import InventoryGrid from './InventoryGrid';

const EquipmentList = ({ equipment }: { equipment: Equipment }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const category = searchParams.get('category');

  const items = category
    ? equipment[`${category}s` as keyof Equipment]
    : equipment['all' as keyof Equipment];

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
      navigate(`inventory/items/${item.id}`);
      clickTimeout.current = null;
    }, 200);
  };

  return (
    <>
      <NavTabs>
        <BtnAuth active={!category} onClick={() => handleTab(null)}>
          All
        </BtnAuth>
        {equipment.weapons.length > 0 && (
          <BtnAuth
            active={category === 'weapon'}
            onClick={() => handleTab('weapon')}
          >
            <WeaponIcon className="size-8" />
          </BtnAuth>
        )}
        {equipment.armors.length > 0 && (
          <BtnAuth
            active={category === 'armor'}
            onClick={() => handleTab('armor')}
          >
            <ArmorIcon className="size-8" />
          </BtnAuth>
        )}
        {equipment.augmentations.length > 0 && (
          <BtnAuth
            active={category === 'cybernetic'}
            onClick={() => handleTab('cybernetic')}
          >
            <CyberIcon className="size-8" />
          </BtnAuth>
        )}
        {equipment.reusables.length > 0 && (
          <BtnAuth
            active={category === 'reusable'}
            onClick={() => handleTab('reusable')}
          >
            <InventoryIcon className="size-8" />
          </BtnAuth>
        )}
        {equipment.consumables.length > 0 && (
          <BtnAuth
            active={category === 'consumable'}
            onClick={() => handleTab('consumable')}
          >
            <PotionIcon className="size-8" />
          </BtnAuth>
        )}
        {equipment.vehicles.length > 0 && (
          <BtnAuth
            active={category === 'vehicle'}
            onClick={() => handleTab('vehicle')}
          >
            <VehicleIcon className="size-8" />
          </BtnAuth>
        )}
        {equipment.drones.length > 0 && (
          <BtnAuth
            active={category === 'drone'}
            onClick={() => handleTab('drone')}
          >
            <DroneIcon className="size-8" />
          </BtnAuth>
        )}
      </NavTabs>
      <InventoryGrid minWidth={175}>
        {items ? (
          items.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onClick={() => handleClick(item)}
            />
          ))
        ) : (
          <h2 className="pl-4">???</h2>
        )}
      </InventoryGrid>
      <Outlet context={{ parts }} />
    </>
  );
};

export default EquipmentList;
