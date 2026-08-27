import BtnAuth from './buttons/BtnAuth';
import ArmorIcon from './icons/ArmorIcon';
import CyberIcon from './icons/CyberIcon';
import DroneIcon from './icons/DroneIcon';
import InventoryIcon from './icons/InventoryIcon';
import PotionIcon from './icons/PotionIcon';
import VehicleIcon from './icons/VehicleIcon';
import WeaponIcon from './icons/WeaponIcon';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import Loading from './Loading';
import { ItemType } from 'src/types/item';
import { useState } from 'react';
import NavTabs from './NavTabs';
import InventoryCard from './InventoryCard';
import InventoryGrid from './InventoryGrid';

const Inventory = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');
  const [types, setTypes] = useState<ItemType[]>([]);

  const { filteredCharacter: character, isLoading } = useCharacter(
    Number(characterId),
  );

  const items = character?.inventory
    ? character?.inventory.filter((item) =>
        item.itemTypes.some(
          (type: ItemType) => types.includes(type) || types.length === 0,
        ),
      )
    : [];

  return (
    <>
      <NavTabs>
        <BtnAuth active={types.length === 0} onClick={() => setTypes([])}>
          All
        </BtnAuth>
        <BtnAuth
          active={types.includes('weapon')}
          onClick={() => setTypes(['weapon'])}
        >
          <WeaponIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('armor')}
          onClick={() => setTypes(['armor'])}
        >
          <ArmorIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('cybernetic') || types.includes('mutation')}
          onClick={() => setTypes(['cybernetic', 'mutation'])}
        >
          <CyberIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('reusable')}
          onClick={() => setTypes(['reusable'])}
        >
          <InventoryIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('consumable')}
          onClick={() => setTypes(['consumable'])}
        >
          <PotionIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('vehicle')}
          onClick={() => setTypes(['vehicle'])}
        >
          <VehicleIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('drone')}
          onClick={() => setTypes(['drone'])}
        >
          <DroneIcon className="size-8" />
        </BtnAuth>
      </NavTabs>
      {isLoading ? (
        <Loading />
      ) : (
        <InventoryGrid minWidth={175}>
          {items ? (
            items.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onClick={() => navigate(`items/${item.id}`)}
              />
            ))
          ) : (
            <h2 className="pl-4">???</h2>
          )}
        </InventoryGrid>
      )}
      <Outlet context={{ parts }} />
    </>
  );
};

export default Inventory;
