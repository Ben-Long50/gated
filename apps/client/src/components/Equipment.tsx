import { useContext, useMemo, useRef, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import EvasionIcon from './icons/EvasionIcon';
import ArmorIcon from './icons/ArmorIcon';
import WardIcon from './icons/WardIcon';
import SpeedIcon from './icons/SpeedIcon';
import InjuryIcon from './icons/InjuryIcon';
import InsanityIcon from './icons/InsanityIcon';
import EquipmentList from './EquipmentList';
import ActionCard from './ActionCard';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import ArrowHeader2 from './ArrowHeader2';
import useCharacter from 'src/hooks/useCharacter';
import ItemCard from './ItemCard';
import CharacterIcon from './icons/CharacterIcon';
import CharacterStatBars from './CharacterStatBars';
import CharacterPicture from './CharacterPicture';
import { LayoutContext } from 'src/contexts/LayoutContext';
import InventoryIcon from './icons/InventoryIcon';
import StatBarContainer from './StatBarContainer';
import CharacterHeader from './CharacterHeader';

const Equipment = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { characterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const parts = location.pathname.split('/');

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
        {activeItem && (
          <ItemCard
            key={active.id}
            item={activeItem}
            cardType={mobile ? 'small' : 'large'}
            ownerId={character?.userId}
          />
        )}
        <div className="flex items-center justify-between">
          <ArrowHeader2 title="Equipped Items" />
          {character?.userId === user?.id && (
            <>
              <button
                className="bg-secondary shadow-color hover:border-accent timing group rounded-md border-2 border-transparent p-2"
                type="button"
                onClick={() => {
                  navigate('inventory');
                }}
              >
                <InventoryIcon className="text-primary group-hover:text-accent size-10" />
              </button>
              {parts.includes('inventory') && (
                <Outlet context={{ activeItem, toggleActive }} />
              )}
            </>
          )}
        </div>
        <EquipmentList
          equipment={character?.equipment}
          active={active}
          toggleActive={toggleActive}
        />
      </div>
    </>
  );
};

export default Equipment;
