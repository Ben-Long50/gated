import BtnAuth from './buttons/BtnAuth';
import { useContext, useMemo } from 'react';
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

const Shop = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { characterId, shopId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');

  const { filteredCharacter: character } = useCharacter(Number(characterId));
  const { filteredCharacter: shop } = useCharacter(Number(shopId));

  const cartLength = useMemo(() => {
    return Object.values(character?.characterCart || {})
      .filter(Array.isArray)
      .flat()
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [character]);

  const { actions, ...shopItems } = shop?.inventory ?? {};

  const categorizedShopItems = shopId
    ? category === 'all'
      ? Object.values(shopItems).flat()
      : shopItems[category]
    : null;

  return (
    <div className="relative flex w-full flex-col gap-8">
      <div className="absolute left-2 top-2 flex items-center gap-4 sm:left-4 sm:top-4">
        <button
          className="group relative"
          onClick={() => setSearchParams({ category: 'cart' })}
        >
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
      <p className="absolute right-4 top-4">
        {character?.profits.toLocaleString()} p
      </p>
      <div className="grid w-full grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-2">
        {shopId && (
          <BtnAuth
            active={category === 'all'}
            onClick={() => setSearchParams({ category: 'all' })}
          >
            <ShopIcon className="size-8" />
          </BtnAuth>
        )}
        {(!categorizedShopItems || shopItems.weapons?.length) > 0 && (
          <BtnAuth
            active={category === 'weapon'}
            onClick={() => setSearchParams({ category: 'weapon' })}
          >
            <WeaponIcon className="size-8" />
          </BtnAuth>
        )}
        {(!categorizedShopItems || shopItems.armors?.length > 0) && (
          <BtnAuth
            active={category === 'armor'}
            onClick={() => setSearchParams({ category: 'armor' })}
          >
            <ArmorIcon className="size-8" />
          </BtnAuth>
        )}
        {(!categorizedShopItems || shopItems.augmentations?.length > 0) && (
          <BtnAuth
            active={category === 'cybernetic'}
            onClick={() => setSearchParams({ category: 'cybernetic' })}
          >
            <CyberIcon className="size-8" />
          </BtnAuth>
        )}
        {(!categorizedShopItems || shopItems.reusables?.length > 0) && (
          <BtnAuth
            active={category === 'reusable'}
            onClick={() => setSearchParams({ category: 'reusable' })}
          >
            <InventoryIcon className="size-8" />
          </BtnAuth>
        )}
        {(!categorizedShopItems || shopItems.consumables?.length > 0) && (
          <BtnAuth
            active={category === 'consumable'}
            onClick={() => setSearchParams({ category: 'consumable' })}
          >
            <PotionIcon className="size-8" />
          </BtnAuth>
        )}
        {(!categorizedShopItems || shopItems.vehicles?.length > 0) && (
          <BtnAuth
            active={category === 'vehicle'}
            onClick={() => setSearchParams({ category: 'vehicle' })}
          >
            <VehicleIcon className="size-8" />
          </BtnAuth>
        )}
        {(!categorizedShopItems || shopItems.drones?.length > 0) && (
          <BtnAuth
            active={category === 'drone'}
            onClick={() => setSearchParams({ category: 'drone' })}
          >
            <DroneIcon className="size-8" />
          </BtnAuth>
        )}
      </div>
      <Divider className="my-0" />
      {category === 'cart' ? <Cart /> : <Items />}
    </div>
  );
};

export default Shop;
