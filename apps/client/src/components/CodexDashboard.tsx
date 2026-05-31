import { useNavigate, useSearchParams } from 'react-router-dom';
import Divider from './Divider';
import useCodexPreviewItemsQuery from 'src/hooks/useCodexPreviewItemsQuery/useCodexPreviewItemsQuery';
import Loading from './Loading';
import BtnAuth from './buttons/BtnAuth';
import NavTabs from './NavTabs';
import { PictureCard } from './PictureCard';
import Container from './Container';

const CodexDashboard = () => {
  const { data, isLoading } = useCodexPreviewItemsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const tab = searchParams.get('tab');

  const items = data?.items.filter(Boolean);
  const characters = data?.characters.filter(Boolean);

  const equipmentLinks = [
    {
      label: 'All Weapons',
      path: 'items?category=weapon&exclude=Vehicle Weapon&exclude=Drone Weapon',
    },
    {
      label: 'Ranged Weapons',
      path: 'items?category=weapon&include=Ranged&exclude=Vehicle Weapon&exclude=Drone Weapon',
    },
    {
      label: 'Melee Weapons',
      path: 'items?category=weapon&include=Melee&exclude=Vehicle Weapon&exclude=Drone Weapon',
    },
    {
      label: 'Consumable Weapons',
      path: 'items?category=weapon&include=Consumable&include=Light Consumable&exclude=Vehicle Weapon&exclude=Drone Weapon',
    },
    {
      label: 'All Armors',
      path: 'items?category=armor',
    },
    {
      label: 'Head Armors',
      path: 'items?category=armor&include=Head',
    },
    {
      label: 'Body Armors',
      path: 'items?category=armor&include=Body',
    },
    {
      label: 'Cloak Armors',
      path: 'items?category=armor&include=Cloak',
    },
    {
      label: 'Cybernetics',
      path: 'items?category=cybernetic',
    },
    {
      label: 'Mutations',
      path: 'items?category=mutation',
    },
    {
      label: 'Vehicles',
      path: 'items?category=vehicle',
    },
    {
      label: 'Vehicle Weapons',
      path: 'items?category=weapon&include=Vehicle Weapon',
    },
    {
      label: 'Drones',
      path: 'items?category=drone',
    },
    {
      label: 'Drone Weapons',
      path: 'items?category=weapon&include=Drone Weapon',
    },
    {
      label: 'Reusables',
      path: 'items?category=reusable',
    },
    {
      label: 'Consumables',
      path: 'items?category=consumable',
    },
  ];

  const characterLinks = [
    {
      label: 'Player Classes',
      path: 'characters?playerCharacter=true',
    },
    {
      label: 'NPC Templates',
      path: 'characters?playerCharacter=false',
    },
    {
      label: 'Goons',
      path: 'characters?playerCharacter=true',
    },
  ];

  return (
    <div className="flex w-full max-w-8xl flex-col items-center gap-8">
      <h1 className="text-center">Codex</h1>
      <Container>
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
          <>
            {tab === 'equipment' && (
              <div className="grid w-full grid-cols-5 gap-4 sm:gap-6">
                {items &&
                  equipmentLinks.map((link, index) => (
                    <PictureCard
                      key={index}
                      label={link.label}
                      publicId={items[index].picture.publicId}
                      onClick={() => navigate(link.path)}
                    />
                  ))}
              </div>
            )}
            {tab === 'characters' && (
              <div className="grid w-full grid-cols-5 gap-4">
                {characters &&
                  characterLinks.map((link, index) => (
                    <PictureCard
                      key={index}
                      label={link.label}
                      publicId={
                        characters[index]
                          ? characters[index].picture.publicId
                          : ''
                      }
                      onClick={() => navigate(link.path)}
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default CodexDashboard;
