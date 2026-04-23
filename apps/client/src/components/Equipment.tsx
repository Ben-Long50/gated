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
import BtnRect from './buttons/BtnRect';
import useCharacter from 'src/hooks/useCharacter';
import ItemCard from './ItemCard';
import CharacterIcon from './icons/CharacterIcon';
import CharacterStatBars from './CharacterStatBars';
import CharacterPicture from './CharacterPicture';
import { LayoutContext } from 'src/contexts/LayoutContext';
import BtnAuth from './buttons/BtnAuth';
import NavTabs from './NavTabs';

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
    <div className="relative flex w-full max-w-9xl flex-col items-center gap-8">
      {/* <NavTabs>
        <Link to="..">
          <BtnAuth>Character Sheet</BtnAuth>
        </Link>
        <Link to="../deployments">
          <BtnAuth>Drones & Vehicles</BtnAuth>
        </Link>
      </NavTabs> */}
      <h1 className="text-center">{`${character?.firstName}'s Equipment`}</h1>
      <div className="flex w-full flex-col gap-8 sm:flex-row">
        {character?.picture?.publicId && (
          <CharacterPicture className="min-w-60" character={character} />
        )}
        <div
          ref={cardRef}
          className={`${cardRef.current?.offsetWidth < 500 ? 'gap-2 px-2' : 'gap-4 px-4'} col-span-1 my-auto grid h-full w-full grow grid-cols-[auto_auto_1fr_auto] place-items-center gap-y-2`}
        >
          <CharacterStatBars
            cardWidth={cardRef.current?.offsetWidth}
            stats={{
              maxHealth: character?.stats.maxHealth,
              maxSanity: character?.stats.maxSanity,
              currentHealth: character?.stats.currentHealth,
              currentSanity: character?.stats.currentSanity,
              maxCyber: character?.stats.maxCyber,
              cyber: character?.stats.cyber,
              weight: character?.stats.weight,
              maxEquip: character?.stats.maxEquip,
            }}
            characterId={character?.id}
          />
        </div>
      </div>
      <div className="flex w-full flex-col justify-start gap-8">
        <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
          <div className="flex h-full w-full flex-col gap-4 p-4 pr-6">
            <ArrowHeader3 title="Character Stats" />
            <div className="grid w-full grid-cols-4 gap-4">
              <div className="bg-secondary flex items-center justify-between gap-2 rounded-md p-2 shadow-md shadow-black">
                <div className="flex items-center justify-center gap-4">
                  <CharacterIcon className="text-secondary size-8 shrink-0" />
                  <h3 className="text-primary text-xl font-semibold tracking-widest">
                    Level
                  </h3>
                </div>
                <p className="text-secondary min-w-6 text-center text-xl sm:pt-1 sm:text-2xl">
                  {character?.level}
                </p>
              </div>
              <div className="bg-secondary flex items-center justify-between gap-2 rounded-md p-2 shadow-md shadow-black">
                <div className="flex items-center justify-center gap-4">
                  <SpeedIcon className="text-secondary size-8 shrink-0" />
                  <h3 className="text-primary text-xl font-semibold tracking-widest">
                    Speed
                  </h3>
                </div>
                <p className="text-secondary min-w-6 text-center text-xl sm:pt-1 sm:text-2xl">
                  {character?.stats.speed}
                </p>
              </div>
              <div className="bg-secondary flex items-center justify-between gap-2 rounded-md p-2 shadow-md shadow-black">
                <div className="flex items-center justify-center gap-4">
                  <ArmorIcon className="text-secondary size-8 shrink-0" />
                  <h3 className="text-primary text-xl font-semibold tracking-widest">
                    Armor
                  </h3>
                </div>
                <p className="text-secondary min-w-6 text-center text-xl sm:pt-1 sm:text-2xl">
                  {character?.stats.armor}
                </p>
              </div>
              <div className="bg-secondary flex items-center justify-between gap-2 rounded-md p-2 shadow-md shadow-black">
                <div className="flex items-center justify-center gap-4">
                  <WardIcon className="text-secondary size-8 shrink-0" />
                  <h3 className="text-primary text-xl font-semibold tracking-widest">
                    Ward
                  </h3>
                </div>
                <p className="text-secondary min-w-6 text-center text-xl sm:pt-1 sm:text-2xl">
                  {character?.stats.ward}
                </p>
              </div>
              <div className="bg-secondary flex items-center justify-between gap-2 rounded-md p-2 shadow-md shadow-black">
                <div className="flex items-center justify-center gap-4">
                  <EvasionIcon className="text-secondary size-8 shrink-0" />
                  <h3 className="text-primary text-xl font-semibold tracking-widest">
                    Evasion
                  </h3>
                </div>
                <p className="text-secondary min-w-6 text-center text-xl sm:pt-1 sm:text-2xl">
                  {character?.stats.evasion}
                </p>
              </div>
              <div className="bg-secondary flex items-center justify-between gap-2 rounded-md p-2 shadow-md shadow-black">
                <div className="flex items-center justify-center gap-4 overflow-hidden">
                  <InjuryIcon className="text-secondary size-8 shrink-0" />
                  <h3 className="text-primary truncate text-xl font-semibold tracking-widest">
                    Injuries
                  </h3>
                </div>
                <p className="text-secondary min-w-6 whitespace-nowrap text-center text-xl sm:pt-1 sm:text-2xl">
                  {character?.stats.injuries || 0} /{' '}
                  {character?.stats.permanentInjuries}
                </p>
              </div>
              <div className="bg-secondary flex items-center justify-between gap-2 rounded-md p-2 shadow-md shadow-black">
                <div className="flex items-center justify-center gap-4 overflow-hidden">
                  <InsanityIcon className="text-secondary size-8 shrink-0" />
                  <h3 className="text-primary truncate text-xl font-semibold tracking-widest">
                    Insanities
                  </h3>
                </div>
                <p className="text-secondary min-w-6 whitespace-nowrap text-center text-xl sm:pt-1 sm:text-2xl">
                  {character?.stats.insanities || 0} /{' '}
                  {character?.stats.permanentInsanities}
                </p>
              </div>
            </div>
            {character?.actions && character?.actions.length > 0 && (
              <>
                <Divider />
                <ArrowHeader3 title="Unique Actions" />
                <div className="grid grid-cols-2 gap-4">
                  {character?.actions
                    .sort((a, b) =>
                      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
                    )
                    .filter((action) => action != null)
                    .map((action: Action) => (
                      <ActionCard key={action?.id} action={action} />
                    ))}
                </div>
              </>
            )}
          </div>
        </ThemeContainer>
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
                <BtnRect
                  ariaLabel="Open inventory"
                  type="button"
                  onClick={() => {
                    navigate('inventory');
                  }}
                >
                  Open Inventory
                </BtnRect>
                {parts.includes('inventory') && (
                  <Outlet context={{ activeItem, toggleActive }} />
                )}
              </>
            )}
          </div>
          <ThemeContainer
            chamfer="medium"
            borderColor={accentPrimary}
            overflowHidden={true}
          >
            <div className="p-4">
              <EquipmentList
                equipment={character?.equipment}
                active={active}
                toggleActive={toggleActive}
              />
            </div>
          </ThemeContainer>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
