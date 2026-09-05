import ArmorIcon from '../icons/ArmorIcon';
import CyberIcon from '../icons/CyberIcon';
import WeaponIcon from '../icons/WeaponIcon';
import LinkListSidebar from './LinkListSidebar';
import SubLinkSidebar from './SubLinkSidebar';
import ActionIcon from '../icons/ActionIcon';
import KeywordIcon from '../icons/KeywordIcon';
import PerkIcon from '../icons/PerkIcon';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import VehicleIcon from '../../components/icons/VehicleIcon';
import ConditionIcon from '../../components/icons/ConditionIcon';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import SackIcon from '../../components/icons/SackIcon';
import LinkSidebar from './LinkSidebar';
import ModificationIcon from '../icons/ModificationIcon';
import DroneIcon from '../icons/DroneIcon';
import PotionIcon from '../icons/PotionIcon';
import PropertyIcon from '../icons/PropertyIcon';
import AdminIcon from '../icons/AdminIcon';
import CharacterIcon from '../icons/CharacterIcon';
import MapIcon from '../icons/MapIcon';

const CodexLinks = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <LinkSidebar
        title="Search Codex"
        icon={
          <Icon
            className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit"
            path={mdiMagnify}
            rotate={90}
          />
        }
        path="/glam/codex/search"
      />
      <LinkListSidebar
        icon={
          <CharacterIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Characters"
      >
        <SubLinkSidebar
          title="Player Classes"
          path="codex/characters?characterType=playerCharacter"
        />
        <SubLinkSidebar
          title="Template NPCs"
          path="codex/characters?characterType=nonPlayerCharacter"
        />
        <SubLinkSidebar
          title="Goons"
          path="codex/characters?characterType=nonPlayerCharacter&npcType=goon"
        />
        <SubLinkSidebar
          title="Monsters"
          path="codex/characters?characterType=nonPlayerCharacter&npcType=monster"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <MapIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Maps"
      >
        <SubLinkSidebar title="All Maps" path="codex/maps" />
        <SubLinkSidebar title="Maps" path="codex/maps?mapType=map" />
        <SubLinkSidebar
          title="Components"
          path="codex/maps?mapType=component"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <WeaponIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Weapons"
      >
        <SubLinkSidebar
          title="All Weapons"
          path="codex/items?category=weapon&exclude=Vehicle Weapon&exclude=Drone Weapon"
        />
        <SubLinkSidebar
          title="Ranged Weapons"
          path="codex/items?category=weapon&include=Ranged&exclude=Vehicle Weapon&exclude=Drone Weapon"
        />
        <SubLinkSidebar
          title="Melee Weapons"
          path="codex/items?category=weapon&include=Melee&exclude=Vehicle Weapon&exclude=Drone Weapon"
        />
        <SubLinkSidebar
          title="Consumable Weapons"
          path="codex/items?category=weapon&include=Consumable&include=Light Consumable&exclude=Vehicle Weapon&exclude=Drone Weapon"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <ArmorIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Armor"
      >
        <SubLinkSidebar title="All Armor" path="codex/items?category=armor" />
        <SubLinkSidebar
          title="Head Armor"
          path="codex/items?category=armor&include=Head"
        />
        <SubLinkSidebar
          title="Body Armor"
          path="codex/items?category=armor&include=Body"
        />
        <SubLinkSidebar
          title="Cloak Armor"
          path="codex/items?category=armor&include=Cloak"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <CyberIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Augmentations"
      >
        <SubLinkSidebar
          title="Cybernetics"
          path="codex/items?category=cybernetic"
        />
        <SubLinkSidebar
          title="Mutations"
          path="codex/items?category=mutation"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <VehicleIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Vehicles"
      >
        <SubLinkSidebar
          title="All Vehicles"
          path="codex/items?category=vehicle"
        />
        <SubLinkSidebar
          title="Vehicle Weapons"
          path="codex/items/?category=weapon&include=Vehicle Weapon"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <DroneIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Drones"
      >
        <SubLinkSidebar title="All Drones" path="codex/items?category=drone" />
        <SubLinkSidebar
          title="Drone Weapons"
          path="codex/items/?category=weapon&include=Drone Weapon"
        />
      </LinkListSidebar>
      <LinkSidebar
        icon={
          <ModificationIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Modifications"
        path="codex/items?category=modifiaction"
      />
      <LinkSidebar
        icon={
          <SackIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Reusable Items"
        path="codex/items?category=reusable"
      />
      <LinkSidebar
        icon={
          <PotionIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Consumable Items"
        path="codex/items?category=consumable"
      />
      <LinkSidebar
        icon={
          <PropertyIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Properties"
        path="codex/properties"
      />
      <LinkSidebar
        icon={
          <PerkIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Perks"
        path="codex/perks"
      />
      <LinkSidebar
        icon={
          <KeywordIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Traits"
        path="codex/keywords"
      />
      <LinkSidebar
        icon={
          <ActionIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Actions"
        path="codex/actions"
      />
      <LinkSidebar
        icon={
          <ConditionIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Conditions"
        path="codex/conditions"
      />
      {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
        <LinkListSidebar
          title="Admin Codex Tools"
          icon={
            <AdminIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
          }
        >
          <SubLinkSidebar
            title="Create Character"
            path="codex/characters/create?formType=codex"
          />
          <SubLinkSidebar
            title="Create Map"
            path="codex/maps/create?formType=codex"
          />
          <SubLinkSidebar
            title="Create Item"
            path="codex/items/create?formType=codex"
          />
          <SubLinkSidebar
            title="Create Property"
            path="codex/properties/create?formType=codex"
          />
          <SubLinkSidebar
            title="Create Perk"
            path="codex/perks/create?formType=codex"
          />
          <SubLinkSidebar
            title="Create Trait"
            path="codex/keywords/create?formType=codex"
          />
          <SubLinkSidebar
            title="Create Action"
            path="codex/actions/create?formType=codex"
          />
          <SubLinkSidebar
            title="Create Condition"
            path="codex/conditions/create?formType=codex"
          />
          <SubLinkSidebar
            title="Create Standard Picture"
            path="codex/pictures/create?formType=codex"
          />
        </LinkListSidebar>
      )}
    </>
  );
};

export default CodexLinks;
