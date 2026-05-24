import { useContext, useMemo, useRef, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import EquipmentList from './EquipmentList';
import { Item } from 'src/types/item';
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

const Equipment = () => {
  const { user } = useContext(AuthContext);
  const { characterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const parts = location.pathname.split('/');
  const [tab, setTab] = useState('equipment');

  const [active, setActive] = useState<{
    id: null | number;
    category: null | string;
  }>(() => {
    const store = localStorage.getItem('activeItem');
    if (store) {
      return JSON.parse(store);
    } else {
      return {
        id: null,
        category: null,
      };
    }
  });

  const toggleActive = (id: number | null, category: string | null) => {
    localStorage.setItem('activeItem', JSON.stringify({ id, category }));
    setActive({ id, category });
  };

  const cardRef = useRef(null);
  const activeRef = useRef(null);

  const { filteredCharacter: character, isLoading } = useCharacter(
    Number(characterId),
  );

  const activeItem = useMemo(() => {
    switch (active?.category) {
      case 'weapon':
        return (
          character?.equipment?.weapons.filter(
            (weapon: Item) => weapon.id === active.id,
          )[0] || null
        );
      case 'armors':
        return (
          character?.equipment?.armors.filter(
            (armor: Item) => armor.id === active.id,
          )[0] || null
        );
      case 'augmentations':
        return (
          character?.equipment?.augmentations.filter(
            (cybernetic: Item) => cybernetic.id === active.id,
          )[0] || null
        );
      case 'reusable':
        return (
          character?.equipment?.reusables.filter(
            (item: Item) => item.id === active.id,
          )[0] || null
        );
      case 'consumable':
        return (
          character?.equipment?.consumables.filter(
            (item: Item) => item.id === active.id,
          )[0] || null
        );
      default:
        return;
    }
  }, [active, character]);

  if (isLoading) return <Loading />;

  return (
    <>
      <CharacterHeader character={character} />
      <div className="flex w-full flex-col gap-8 sm:flex-row">
        {character?.picture?.publicId && (
          <CharacterPicture className="min-w-60" character={character} />
        )}
        <StatBarContainer>
          <CharacterStatBars
            cardWidth={cardRef.current?.offsetWidth}
            stats={character?.stats}
            characterId={character?.id}
          />
        </StatBarContainer>
      </div>
      <Divider />
      <div ref={activeRef} className="col-span-2 flex w-full flex-col gap-8">
        <NavTabs className="grid-cols-3">
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
              {parts.includes('inventory') && (
                <Outlet context={{ activeItem, toggleActive }} />
              )}
            </>
          )}
        </NavTabs>
        {tab === 'equipment' && (
          <div className="grid grid-cols-5 gap-8">
            <div className="flex flex-col gap-4">
              <p className="w-full text-center font-zen text-2xl">Weapons</p>
              {character?.equipment?.weapons.map((weapon) => (
                <InventoryCard
                  item={weapon}
                  onClick={() => navigate(`inventory/items/${weapon.id}`)}
                />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="w-full text-center font-zen text-2xl">Armors</p>
              {character?.equipment?.armors.map((armor) => (
                <InventoryCard
                  item={armor}
                  onClick={() => navigate(`inventory/items/${armor.id}`)}
                />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="w-full text-center font-zen text-2xl">
                Augmentations
              </p>
              {character?.equipment?.augmentations.map((augmentation) => (
                <InventoryCard
                  item={augmentation}
                  onClick={() => navigate(`inventory/items/${augmentation.id}`)}
                />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="w-full text-center font-zen text-2xl">Reusables</p>
              {character?.equipment?.reusables.map((reusable) => (
                <InventoryCard
                  item={reusable}
                  onClick={() => navigate(`inventory/items/${reusable.id}`)}
                />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="w-full text-center font-zen text-2xl">
                Consumables
              </p>
              {character?.equipment?.consumables.map((consumable) => (
                <InventoryCard
                  item={consumable}
                  onClick={() => navigate(`inventory/items/${consumable.id}`)}
                />
              ))}
            </div>
          </div>
        )}
        {tab === 'actions' && (
          <div className="grid grid-cols-2 gap-4">
            {character?.actions?.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Equipment;
