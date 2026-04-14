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
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <SubLinkSidebar
            title="Create a New Weapon"
            path="codex/items/create?category=weapon"
          />
        )}
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
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <SubLinkSidebar
            title="Create New Armor"
            path="codex/items/create?category=armor"
          />
        )}
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
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <SubLinkSidebar
            title="Create a New Augmentation"
            path="codex/items/create?category=cybernetic"
          />
        )}
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
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <>
            <SubLinkSidebar
              title="Create a New Vehicle"
              path="codex/items/create?category=vehicle"
            />
          </>
        )}
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
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <>
            <SubLinkSidebar
              title="Create a New Drone"
              path="codex/items/create?category=drone"
            />
          </>
        )}
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
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <>
            <SubLinkSidebar
              title="Create a New Modification"
              path="codex/items/create?category=modification"
            />
          </>
        )}
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
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <>
            <SubLinkSidebar
              title="Create a New Reusable"
              path="codex/items/create?category=reusable"
            />
          </>
        )}
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
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <>
            <SubLinkSidebar
              title="Create a New Consumable"
              path="codex/items/create?category=consumable"
            />
          </>
        )}
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <PropertyIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Properties"
      >
        <SubLinkSidebar title="All Properties" path="codex/properties" />
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <>
            <SubLinkSidebar
              title="Create a New Property"
              path="codex/properties/create"
            />
          </>
        )}
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <PerkIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Perks"
      >
        <SubLinkSidebar title="All Perks" path="codex/perks" />
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <SubLinkSidebar title="Create a New Perk" path="codex/perks/create" />
        )}
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <KeywordIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Traits"
      >
        <SubLinkSidebar title="All Traits" path="codex/keywords" />
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <SubLinkSidebar
            title="Create a New Trait"
            path="codex/keywords/create"
          />
        )}
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <ActionIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Actions"
      >
        <SubLinkSidebar title="All Actions" path="codex/actions" />
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <SubLinkSidebar
            title="Create a New Action"
            path="codex/actions/create"
          />
        )}
      </LinkListSidebar>
      <LinkListSidebar
        icon={
          <ConditionIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Conditions"
      >
        <SubLinkSidebar title="All conditions" path="codex/conditions" />
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <SubLinkSidebar
            title="Create a New Condition"
            path="codex/conditions/create"
          />
        )}
      </LinkListSidebar>
    </>
  );
};

export default CodexLinks;
