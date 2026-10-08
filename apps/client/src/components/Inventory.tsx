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
import { Item } from 'src/types/item';
import NavTabs from './NavTabs';
import InventoryCard from './InventoryCard';
import InventoryGrid from './InventoryGrid';
import useItems from 'src/hooks/useItems';
import IconBtnMedium from './buttons/IconBtnMedium';
import InputField from './formFields/InputField';
import { mdiSync } from '@mdi/js';
import Icon from '@mdi/react';
import useParts from 'src/hooks/useParts';
import CartButton from './CartButton';

const Inventory = ({
  itemList,
  shopCharacterId,
}: {
  itemList?: Item[];
  shopCharacterId?: number;
}) => {
  const { characterId } = useParams();
  const navigate = useNavigate();

  const { parts } = useParts();

  const { filteredCharacter: character } = useCharacter(Number(characterId));

  const list = itemList ?? character?.inventory ?? [];

  const {
    items,
    query,
    filterByQuery,
    types,
    filterByTypes,
    resetList,
    isLoading: itemsLoading,
  } = useItems(list.map((item) => item.id));

  return (
    <>
      <NavTabs>
        <BtnAuth active={types.length === 0} onClick={() => filterByTypes([])}>
          All
        </BtnAuth>
        <BtnAuth
          active={types.includes('weapon')}
          onClick={() => filterByTypes(['weapon'])}
        >
          <WeaponIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('armor')}
          onClick={() => filterByTypes(['armor'])}
        >
          <ArmorIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('cybernetic') || types.includes('mutation')}
          onClick={() => filterByTypes(['cybernetic', 'mutation'])}
        >
          <CyberIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('reusable')}
          onClick={() => filterByTypes(['reusable'])}
        >
          <InventoryIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('consumable')}
          onClick={() => filterByTypes(['consumable'])}
        >
          <PotionIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('vehicle')}
          onClick={() => filterByTypes(['vehicle'])}
        >
          <VehicleIcon className="size-8" />
        </BtnAuth>
        <BtnAuth
          active={types.includes('drone')}
          onClick={() => filterByTypes(['drone'])}
        >
          <DroneIcon className="size-8" />
        </BtnAuth>
      </NavTabs>
      <div className="flex items-center gap-4">
        <InputField
          label="Search Items"
          value={query}
          onChange={(value) => {
            filterByQuery(value);
          }}
        />

        <IconBtnMedium onClick={resetList} tooltip="Reset Search">
          <Icon path={mdiSync} />
        </IconBtnMedium>
      </div>
      {itemsLoading ? (
        <Loading />
      ) : (
        <InventoryGrid minWidth={175}>
          {items ? (
            items.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                button={
                  parts.includes('shop') ? (
                    <CartButton
                      className="absolute right-1 top-1"
                      characterId={shopCharacterId ?? Number(characterId)}
                      itemId={item.id}
                    />
                  ) : undefined
                }
                onClick={() =>
                  navigate(
                    parts.includes('inventory')
                      ? parts.includes('modal')
                        ? `items/${item.id}`
                        : `modal/items/${item.id}`
                      : `inventory/items/${item.id}`,
                  )
                }
              />
            ))
          ) : (
            <h2 className="pl-4">???</h2>
          )}
        </InventoryGrid>
      )}
      {!parts.includes('shop') && <Outlet />}
    </>
  );
};

export default Inventory;
