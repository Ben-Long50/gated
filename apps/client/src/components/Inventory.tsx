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
import CharacterHeader from './characterComponents/CharacterHeader';
import { PictureCard } from './PictureCard';

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
              <PictureCard
                className="group relative border-opacity-50 hover:border-opacity-100"
                label={item.name}
                publicId={item.picture.publicId}
                style={{ borderColor: rarityColorMap[item.rarity] }}
                key={index}
                onClick={() => {
                  navigate(`items/${item.id}`);
                  handleDoubleClick(item);
                }}
              >
                {item.equipped === true && (
                  <Icon
                    className="timing text-tertiary group-hover:text-secondary absolute left-1 top-1"
                    path={mdiCheckCircle}
                    size={1.5}
                  />
                )}
              </PictureCard>
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
