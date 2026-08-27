import BtnAuth from './buttons/BtnAuth';
import { useContext, useMemo, useState } from 'react';
import WeaponIcon from './icons/WeaponIcon';
import ArmorIcon from './icons/ArmorIcon';
import CyberIcon from './icons/CyberIcon';
import InventoryIcon from './icons/InventoryIcon';
import PotionIcon from './icons/PotionIcon';
import VehicleIcon from './icons/VehicleIcon';
import DroneIcon from './icons/DroneIcon';
import Icon from '@mdi/react';
import { mdiCartOutline } from '@mdi/js';
import CharacterPictureRound from './characterComponents/CharacterPictureRound';
import ShopIcon from './icons/ShopIcon';
import { useParams, useSearchParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import Divider from './Divider';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Items from './Items';
import Cart from './Cart';
import NavTabs from './NavTabs';
import BulkItemForm from './forms/BulkItemForm';
import { ItemType } from 'src/types/item';
import useItemTypeQueries from 'src/hooks/useItemQueries/useItemTypeQueries';

const Shop = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { characterId, shopId } = useParams();
  const [types, setTypes] = useState<(ItemType | 'cart' | 'bulk')[]>([]);

  const { filteredCharacter: character } = useCharacter(Number(characterId));
  const { filteredCharacter: shop } = useCharacter(Number(shopId));

  const { items, isLoading } = useItemTypeQueries(types);

  const cartLength = Object.values(character?.characterCart || {})
    .filter(Array.isArray)
    .flat()
    .reduce((sum, item) => sum + item.quantity, 0);

  const shopItems = shopId ? shop?.inventory : items;

  const categorizedShopItems = shop?.inventory
    ? shop?.inventory.filter((item) =>
        item.itemTypes.some(
          (type: ItemType) => types.includes(type) || types.length === 0,
        ),
      )
    : [];

  return (
    <>
      <div className="flex w-full items-center justify-center gap-4 px-8">
        {shopId ? (
          <CharacterPictureRound character={shop} />
        ) : (
          <CharacterPictureRound character={character} />
        )}
        <h2 className="text-left">
          {shopId ? `${shop?.firstName}'s Shop` : 'Global Shop'}
        </h2>
      </div>
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center justify-start gap-4">
          <button className="group relative" onClick={() => setTypes(['cart'])}>
            <Icon
              className="group-hover:text-accent text-secondary timing size-12 shrink-0 p-2"
              path={mdiCartOutline}
            />
            <p
              className="shadow-color absolute right-0 top-0 flex h-6 min-w-6 items-center justify-center rounded-full pt-0.5 text-center text-base font-semibold shadow-md dark:text-gray-950"
              style={{ backgroundColor: accentPrimary }}
            >
              {cartLength}
            </p>
          </button>
          <CharacterPictureRound className="size-9" character={character} />
        </div>
        <p>{character?.profits.toLocaleString()} p</p>
      </div>
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
      <BtnAuth
        active={types.includes('bulk')}
        onClick={() => setTypes(['bulk'])}
      >
        Bulk Item Select
      </BtnAuth>
      <Divider className="my-0" />
      {types.includes('bulk') && <BulkItemForm />}
      {types.includes('cart') && <Cart />}
      {!types.includes('bulk') && !types.includes('cart') && (
        <Items itemTypes={types} />
      )}
    </>
  );
};

export default Shop;
