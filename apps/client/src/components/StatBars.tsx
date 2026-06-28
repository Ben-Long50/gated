import { useContext } from 'react';
import DamageIcon from './icons/DamageIcon';
import EquipIcon from './icons/EquipIcon';
import FlurryIcon from './icons/FlurryIcon';
import MagCapacityIcon from './icons/MagCapacityIcon';
import RangeIcon from './icons/RangeIcon';
import SalvoIcon from './icons/SalvoIcon';
import StatBar from './StatBar';
import { ThemeContext } from '../contexts/ThemeContext';
import CyberIcon from './icons/CyberIcon';
import ArmorIcon from './icons/ArmorIcon';
import WardIcon from './icons/WardIcon';
import BlockIcon from './icons/BlockIcon';
import LightningIcon from './icons/LightningIcon';
import SizeIcon from './icons/SizeIcon';
import VehicleSpeedIcon from './icons/VehicleSpeedIcon';
import AgilityIcon from './icons/AgilityIcon';
import HullIcon from './icons/HullIcon';
import CargoIcon from './icons/CargoIcon';
import PassIcon from './icons/PassIcon';
import VehicleWeaponIcon from './icons/VehicleWeaponIcon';
import { Stats } from 'src/types/item';
import DroneIcon from './icons/DroneIcon';
import WyrmShellIcon from './icons/WyrmShellIcon';
import InsanityIcon from './icons/InsanityIcon';
import WyrmMoldSlotsIcon from './icons/WyrmMoldSlotsIcon';
import SanityDamageIcon from './icons/SanityDamageIcon';

const StatBars = ({
  stats,
  size = 'small',
}: {
  stats: Stats;
  size: 'small' | 'large';
}) => {
  const { statColorMap } = useContext(ThemeContext);

  return (
    <>
      {stats.damage !== undefined && (
        <StatBar
          title="DMG"
          current={stats.damage}
          color={statColorMap['DMG']}
          size={size}
        >
          <DamageIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.sanityDamage !== undefined && (
        <StatBar
          title="SDMG"
          current={stats.sanityDamage}
          color={statColorMap['SDMG']}
          size={size}
        >
          <SanityDamageIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.salvo !== undefined && (
        <StatBar
          title="SLV"
          current={stats.salvo}
          color={statColorMap['SLV']}
          size={size}
        >
          <SalvoIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.flurry !== undefined && (
        <StatBar
          title="FLR"
          current={stats.flurry}
          color={statColorMap['FLR']}
          size={size}
        >
          <FlurryIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.range !== undefined && (
        <StatBar
          title="RNG"
          current={stats.range}
          color={statColorMap['RNG']}
          size={size}
        >
          <RangeIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentMagCount
        ? stats.currentAmmoCount !== undefined &&
          stats.magCapacity !== undefined && (
            <StatBar
              title="MAG"
              total={stats.magCapacity}
              current={stats.currentAmmoCount}
              reserve={stats.currentMagCount * stats.magCapacity}
              color={statColorMap['MAG']}
              size={size}
            >
              <MagCapacityIcon className="text-secondary size-8" />
            </StatBar>
          )
        : stats.magCapacity !== undefined &&
          stats.magCount !== undefined && (
            <StatBar
              title="MAG"
              total={stats.magCapacity}
              current={stats.magCapacity}
              reserve={(stats.magCount - 1) * stats.magCapacity}
              color={statColorMap['MAG']}
              size={size}
            >
              <MagCapacityIcon className="text-secondary size-8" />
            </StatBar>
          )}

      {stats.cyber !== undefined && stats.maxCyber !== undefined && (
        <StatBar
          title="CBR"
          current={stats.cyber}
          total={stats.maxCyber}
          color={statColorMap['Cyber']}
          size={size}
        >
          <CyberIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentHull !== undefined ? (
        <StatBar
          title="HV"
          current={stats.currentHull}
          total={stats.hull}
          color={statColorMap['HULL']}
          size={size}
        >
          <HullIcon className="text-secondary size-8" />
        </StatBar>
      ) : (
        stats.hull !== undefined && (
          <StatBar
            title="HV"
            current={stats.hull}
            color={statColorMap['HULL']}
            size={size}
          >
            <HullIcon className="text-secondary size-8" />
          </StatBar>
        )
      )}
      {stats.armor !== undefined && (
        <StatBar
          title="AV"
          current={stats.armor}
          color={statColorMap['AV']}
          size={size}
        >
          <ArmorIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.size !== undefined && (
        <StatBar
          title="SZE"
          current={stats.size}
          color={statColorMap['SZE']}
          size={size}
        >
          <SizeIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.speed !== undefined && (
        <StatBar
          title="SPD"
          current={stats.speed}
          color={statColorMap['SPD']}
          size={size}
        >
          <VehicleSpeedIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.agility !== undefined && (
        <StatBar
          title="AGL"
          current={stats.agility}
          color={statColorMap['AGL']}
          size={size}
        >
          <AgilityIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentCargo !== undefined ? (
        <StatBar
          title="CRG"
          current={stats.currentCargo}
          total={stats.cargo}
          color={statColorMap['CRG']}
          size={size}
        >
          <CargoIcon className="text-secondary size-8" />
        </StatBar>
      ) : (
        stats.cargo !== undefined && (
          <StatBar
            title="CRG"
            current={stats.cargo}
            color={statColorMap['CRG']}
            size={size}
          >
            <CargoIcon className="text-secondary size-8" />
          </StatBar>
        )
      )}
      {stats.currentPass !== undefined ? (
        <StatBar
          title="OCC"
          current={stats.currentPass}
          total={stats.pass}
          color={statColorMap['PASS']}
          size={size}
        >
          <PassIcon className="text-secondary size-8" />
        </StatBar>
      ) : (
        stats.pass !== undefined && (
          <StatBar
            title="OCC"
            current={stats.pass}
            color={statColorMap['PASS']}
            size={size}
          >
            <PassIcon className="text-secondary size-8" />
          </StatBar>
        )
      )}
      {stats.turret !== undefined && stats.currentTurret !== undefined && (
        <StatBar
          title="TUR"
          current={stats.currentTurret}
          total={stats.turret}
          color={statColorMap['TUR']}
          size={size}
        >
          <DroneIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.weapon !== undefined && stats.currentWeapon !== undefined && (
        <StatBar
          title="WPN"
          current={stats.currentWeapon}
          total={stats.weapon}
          color={statColorMap['WPN']}
          size={size}
        >
          <VehicleWeaponIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.ward !== undefined && (
        <StatBar
          title="WV"
          current={stats.ward}
          color={statColorMap['WV']}
          size={size}
        >
          <WardIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentBlock
        ? stats.block !== undefined &&
          stats.currentBlock !== undefined && (
            <StatBar
              title="BP"
              total={stats.block}
              current={stats.currentBlock}
              color={statColorMap['BP']}
              size={size}
            >
              <BlockIcon className="text-secondary size-8" />
            </StatBar>
          )
        : stats.block !== undefined && (
            <StatBar
              title="BP"
              total={stats.block}
              current={stats.block}
              color={statColorMap['BP']}
              size={size}
            >
              <BlockIcon className="text-secondary size-8" />
            </StatBar>
          )}
      {stats.currentPower !== undefined ? (
        <StatBar
          title="PWR"
          total={stats.power}
          current={stats.currentPower}
          color="rgb(107, 255, 124)"
          size={size}
        >
          <LightningIcon className="text-secondary size-8" />
        </StatBar>
      ) : (
        stats.power !== undefined && (
          <StatBar
            title="PWR"
            current={stats.power}
            color="rgb(107, 255, 124)"
            size={size}
          >
            <LightningIcon className="text-secondary size-8" />
          </StatBar>
        )
      )}
      {stats.wyrmMoldSlots !== undefined &&
        stats.currentWyrmMoldSlots !== undefined && (
          <StatBar
            title="WMS"
            current={stats.currentWyrmMoldSlots}
            total={stats.wyrmMoldSlots}
            color={statColorMap['WMS']}
            size={size}
          >
            <WyrmMoldSlotsIcon className="text-secondary size-8" />
          </StatBar>
        )}
      {stats.wyrmMoldPoints !== undefined && (
        <StatBar
          title="WMP"
          current={stats.wyrmMoldPoints}
          color={statColorMap['WMP']}
          size={size}
        >
          <WyrmShellIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.esotericCharges !== undefined &&
        stats.currentEsotericCharges !== undefined && (
          <StatBar
            title="EC"
            current={stats.currentEsotericCharges}
            total={stats.esotericCharges}
            color={statColorMap['EC']}
            size={size}
          >
            <InsanityIcon className="text-secondary size-8" />
          </StatBar>
        )}
      {stats.weight !== undefined && (
        <StatBar
          title="WGT"
          current={stats.weight}
          color={statColorMap['WGT']}
          size={size}
        >
          <EquipIcon className="text-secondary size-8" />
        </StatBar>
      )}
    </>
  );
};

export default StatBars;
