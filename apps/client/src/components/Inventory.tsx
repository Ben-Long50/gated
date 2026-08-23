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
  useParams,
  useSearchParams,
} from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import Loading from './Loading';
import { Item } from 'src/types/item';
import { useContext, useRef } from 'react';
import NavTabs from './NavTabs';
import InventoryCard from './InventoryCard';
import { LayoutContext } from 'src/contexts/LayoutContext';
import InventoryGrid from './InventoryGrid';

const Inventory = () => {
  const { mobile } = useContext(LayoutContext);
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
    ? character?.inventory?.filter((item) => item.itemTypes.includes(category))
    : character?.inventory;

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
      navigate(
        parts.includes('inventory')
          ? `items/${item.id}`
          : `inventory/items/${item.id}`,
      );
      clickTimeout.current = null;
    }, 200);
  };

  return (
    <>
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

      {isLoading ? (
        <Loading />
      ) : (
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
      )}
      <Outlet context={{ parts }} />
    </>
  );
};

export default Inventory;
