import { useNavigate, useSearchParams } from 'react-router-dom';
import useCodexPreviewItemsQuery from 'src/hooks/useCodexPreviewItemsQuery/useCodexPreviewItemsQuery';
import Loading from './Loading';
import BtnAuth from './buttons/BtnAuth';
import NavTabs from './NavTabs';
import { PictureCard } from './PictureCard';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';
import InventoryGrid from './InventoryGrid';

const CodexDashboard = () => {
  const { mobile } = useContext(LayoutContext);
  const { data, isLoading } = useCodexPreviewItemsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const tab = searchParams.get('tab');

  const items = data?.items.filter(Boolean);
  const characters = data?.characters.filter(Boolean);

  const equipmentLinks = [
    {
      label: 'All Weapons',
      path: '../items?category=weapon&exclude=Vehicle Weapon&exclude=Drone Weapon',
    },
    {
      label: 'Ranged Weapons',
      path: '../items?category=weapon&include=Ranged&exclude=Vehicle Weapon&exclude=Drone Weapon',
    },
    {
      label: 'Melee Weapons',
      path: '../items?category=weapon&include=Melee&exclude=Vehicle Weapon&exclude=Drone Weapon',
    },
    {
      label: 'Consumable Weapons',
      path: '../items?category=weapon&include=Consumable&include=Light Consumable&exclude=Vehicle Weapon&exclude=Drone Weapon',
    },
    {
      label: 'All Armors',
      path: '../items?category=armor',
    },
    {
      label: 'Head Armors',
      path: '../items?category=armor&include=Head',
    },
    {
      label: 'Body Armors',
      path: '../items?category=armor&include=Body',
    },
    {
      label: 'Cloak Armors',
      path: '../items?category=armor&include=Cloak',
    },
    {
      label: 'Cybernetics',
      path: '../items?category=cybernetic',
    },
    {
      label: 'Mutations',
      path: '../items?category=mutation',
    },
    {
      label: 'Vehicles',
      path: '../items?category=vehicle',
    },
    {
      label: 'Vehicle Weapons',
      path: '../items?category=weapon&include=Vehicle Weapon',
    },
    {
      label: 'Drones',
      path: '../items?category=drone',
    },
    {
      label: 'Drone Weapons',
      path: '../items?category=weapon&include=Drone Weapon',
    },
    {
      label: 'Reusables',
      path: '../items?category=reusable',
    },
    {
      label: 'Consumables',
      path: '../items?category=consumable',
    },
  ];

  const characterLinks = [
    {
      label: 'Player Classes',
      path: '../characters?characterType=playerCharacter',
    },
    {
      label: 'Unique NPCs',
      path: '../characters?characterType=nonPlayerCharacter',
    },
    {
      label: 'Goons',
      path: '../characters?characterType=nonPlayerCharacter&npcType=goon',
    },
    {
      label: 'Merchants',
      path: '../characters?characterType=nonPlayerCharacter&npcType=shop',
    },
    {
      label: 'Monsters',
      path: '../characters?characterType=nonPlayerCharacter&npcType=monster',
    },
  ];

  return (
    <>
      <NavTabs>
        <BtnAuth
          active={tab === 'equipment'}
          onClick={() => setSearchParams({ tab: 'equipment' })}
        >
          Equipment
        </BtnAuth>
        <BtnAuth
          active={tab === 'characters'}
          onClick={() => setSearchParams({ tab: 'characters' })}
        >
          Characters
        </BtnAuth>
        <BtnAuth
          active={tab === 'gameplay'}
          onClick={() => setSearchParams({ tab: 'gameplay' })}
        >
          Gameplay
        </BtnAuth>
      </NavTabs>
      {isLoading ? (
        <Loading />
      ) : (
        <InventoryGrid minWidth={175}>
          {tab === 'equipment' &&
            items &&
            equipmentLinks.map((link, index) => (
              <PictureCard
                key={index}
                label={link.label}
                publicId={items[index].generatedPicture?.publicId}
                onClick={() => navigate(link.path)}
              />
            ))}
          {tab === 'characters' &&
            characters &&
            characterLinks.map((link, index) => (
              <PictureCard
                key={index}
                label={link.label}
                publicId={
                  characters[index]
                    ? characters[index].generatedPicture?.publicId
                    : ''
                }
                onClick={() => navigate(link.path)}
              />
            ))}
        </InventoryGrid>
      )}
    </>
  );
};

export default CodexDashboard;
