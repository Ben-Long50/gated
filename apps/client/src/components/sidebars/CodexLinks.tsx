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

const CodexLinks = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <LinkSidebar
        title="Search Codex"
        icon={
          <Icon
            className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit"
            path={mdiMagnify}
            rotate={90}
          />
        }
        path="/glam/codex/search"
      />
      <LinkListSidebar
        icon={
          <WeaponIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
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
          <ArmorIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
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
          <CyberIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
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
          <VehicleIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
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
          <DroneIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Drones"
      >
        <SubLinkSidebar title="All Drones" path="codex/items?category=drone" />
        <SubLinkSidebar
          title="Drone Weapons"
          path="codex/items/?category=weapon&include=Drone Weapon"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <ModificationIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Modifications"
      >
        <SubLinkSidebar
          title="All Modifications"
          path="codex/items?category=modifiaction"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <SackIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Reusable Items"
      >
        <SubLinkSidebar
          title="All Reusables"
          path="codex/items?category=reusable"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <PotionIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Consumable Items"
      >
        <SubLinkSidebar
          title="All Consumables"
          path="codex/items?category=consumable"
        />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <PropertyIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Properties"
      >
        <SubLinkSidebar title="All Properties" path="codex/properties" />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <PerkIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Perks"
      >
        <SubLinkSidebar title="All Perks" path="codex/perks" />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <KeywordIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Traits"
      >
        <SubLinkSidebar title="All Traits" path="codex/keywords" />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <ActionIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Actions"
      >
        <SubLinkSidebar title="All Actions" path="codex/actions" />
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <ConditionIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Conditions"
      >
        <SubLinkSidebar title="All conditions" path="codex/conditions" />
      </LinkListSidebar>
      {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
        <LinkListSidebar
          title="Admin Codex Tools"
          icon={
            <AdminIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
          }
        >
          <SubLinkSidebar
            title="Create a New Base Item"
            path="codex/items/create"
          />
          <SubLinkSidebar
            title="Create a New Base Property"
            path="codex/properties/create"
          />
          <SubLinkSidebar title="Create a New Perk" path="codex/perks/create" />
          <SubLinkSidebar
            title="Create a New Base Trait"
            path="codex/keywords/create"
          />
          <SubLinkSidebar
            title="Create a New Base Action"
            path="codex/actions/create"
          />
          <SubLinkSidebar
            title="Create a New Base Condition"
            path="codex/conditions/create"
          />
        </LinkListSidebar>
      )}
    </>
  );
};

export default CodexLinks;
