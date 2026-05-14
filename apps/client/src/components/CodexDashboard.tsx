import { Link, useSearchParams } from 'react-router-dom';
import ArrowHeader2 from './ArrowHeader2';
import Divider from './Divider';
import useCodexPreviewItemsQuery from 'src/hooks/useCodexPreviewItemsQuery/useCodexPreviewItemsQuery';
import Loading from './Loading';
import CloudinaryImage from './CloudinaryImage';
import EquipmentIcon from './icons/EquipmentIcon';
import Icon from '@mdi/react';
import { mdiImage } from '@mdi/js';
import CharacterIcon from './icons/CharacterIcon';
import BtnAuth from './buttons/BtnAuth';
import { useState } from 'react';
import { capitalCase } from 'change-case';
import NavTabs from './NavTabs';

const CodexCard = ({
  label,
  path,
  publicId,
}: {
  label: string;
  path: string;
  publicId: string;
}) => {
  return (
    <Link className="w-full" to={path}>
      <button className="bg-primary hover:border-accent timing shadow-color group w-full overflow-hidden rounded-md border-2 border-zinc-800 pb-4">
        {publicId ? (
          <CloudinaryImage
            className="timing aspect-square w-full origin-bottom group-hover:scale-105"
            publicId={publicId}
            style={{
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 90%',
            }}
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center">
            <Icon
              className="text-tertiary opacity-50"
              path={mdiImage}
              size={4}
            />
          </div>
        )}
        <p className="group-hover:text-accent timing">{label}</p>
      </button>
    </Link>
  );
};

const CodexDashboard = () => {
  const { data, isLoading } = useCodexPreviewItemsQuery();
  const [searchParams, setSearchParams] = useSearchParams();

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
      <Divider />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {tab === 'equipment' && (
            <div className="grid w-full grid-cols-5 gap-4 sm:gap-6">
              {items &&
                equipmentLinks.map((link, index) => (
                  <CodexCard
                    key={index}
                    label={link.label}
                    publicId={items[index].picture.publicId}
                    path={link.path}
                  />
                ))}
            </div>
          )}
          {tab === 'characters' && (
            <div className="grid w-full grid-cols-5 gap-4">
              {characters &&
                characterLinks.map((link, index) => (
                  <CodexCard
                    key={index}
                    label={link.label}
                    publicId={
                      characters[index]
                        ? characters[index].picture.publicId
                        : ''
                    }
                    path={link.path}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CodexDashboard;
