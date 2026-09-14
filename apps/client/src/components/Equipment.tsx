import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ItemType } from 'src/types/item';
import Divider from './Divider';
import useCharacter from 'src/hooks/useCharacter';
import CharacterStatBars from './characterComponents/CharacterStatBars';
import CharacterPicture from './characterComponents/CharacterPicture';
import StatBarContainer from './StatBarContainer';
import CharacterHeader from './characterComponents/CharacterHeader';
import InventoryCard from './InventoryCard';
import BtnAuth from './buttons/BtnAuth';
import NavTabs from './NavTabs';
import ActionCard from './ActionCard';
import { LayoutContext } from 'src/contexts/LayoutContext';
import DroneIcon from './icons/DroneIcon';
import WeaponIcon from './icons/WeaponIcon';
import ArmorIcon from './icons/ArmorIcon';
import CyberIcon from './icons/CyberIcon';
import InventoryIcon from './icons/InventoryIcon';
import PotionIcon from './icons/PotionIcon';
import VehicleIcon from './icons/VehicleIcon';
import InventoryGrid from './InventoryGrid';

const Equipment = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { characterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const parts = location.pathname.split('/');
  const [tab, setTab] = useState('equipment');
  const [types, setTypes] = useState<ItemType[]>([]);

  const size = mobile ? 'small' : 'large';

  const activeRef = useRef(null);

  const { filteredCharacter: character, isLoading } = useCharacter(
    Number(characterId),
  );

  const equipment = character?.equipment
    ? character?.equipment.filter((item) =>
        item.itemTypes.some(
          (type: ItemType) => types.includes(type) || types.length === 0,
        ),
      )
    : [];

  if (isLoading) return <Loading />;

  return (
    <>
      <CharacterHeader character={character} />
      <div
        className={`${mobile ? 'flex flex-col gap-4' : 'grid grid-cols-[2fr,3fr] gap-8'} w-full items-center`}
      >
        {character?.generatedPicture?.publicId && (
          <CharacterPicture character={character} />
        )}
        <StatBarContainer size={size}>
          <CharacterStatBars
            stats={character?.stats}
            characterId={character?.id}
            size={size}
          />
        </StatBarContainer>
      </div>
      <Divider />
      <div ref={activeRef} className="col-span-2 flex w-full flex-col gap-8">
        <NavTabs>
          <BtnAuth
            active={tab === 'equipment'}
            onClick={() => setTab('equipment')}
          >
            Equipment
          </BtnAuth>
          <BtnAuth active={tab === 'actions'} onClick={() => setTab('actions')}>
            Unique Actions
          </BtnAuth>
          {character?.userId === user?.id && (
            <>
              <BtnAuth onClick={() => navigate('inventory')}>Inventory</BtnAuth>
              {parts.includes('inventory') && <Outlet />}
            </>
          )}
        </NavTabs>
        {tab === 'equipment' && (
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
                active={
                  types.includes('cybernetic') || types.includes('mutation')
                }
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
            <InventoryGrid minWidth={175}>
              {equipment.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate(`items/${item.id}`)}
                />
              ))}
            </InventoryGrid>
          </>
        )}
        {tab === 'actions' && (
          <div className="grid grid-cols-2 gap-4">
            {character?.actions.map((action) => (
              <ActionCard key={action.id} actionId={action.id} size={size} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Equipment;
