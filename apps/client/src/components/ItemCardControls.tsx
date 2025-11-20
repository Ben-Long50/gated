import BtnControl from './buttons/BtnControl';
import DamageIcon from './icons/DamageIcon';
import MagCapacityIcon from './icons/MagCapacityIcon';
import SalvoIcon from './icons/SalvoIcon';
import SpareAmmoIcon from './icons/SpareAmmoIcon';
import BlockIcon from './icons/BlockIcon';
import HullIcon from './icons/HullIcon';
import LightningIcon from './icons/LightningIcon';
import PowerIcon from './icons/PowerIcon';
import CargoIcon from './icons/CargoIcon';
import InventoryIcon from './icons/InventoryIcon';
import PassIcon from './icons/PassIcon';
import { Stats } from 'src/types/item';
import useItemStatMutation from 'src/hooks/item stat hooks/useItemStatMutation/useItemStatMutation';

export const WeaponControls = ({
  stats,
  weaponId,
  cardType,
}: {
  stats: Stats;
  weaponId: number;
  cardType?: 'small' | 'large';
}) => {
  const editItemStat = useItemStatMutation();

  return (
    <div
      className={`${cardType === 'small' ? 'flex flex-col' : 'col-span-2 grid grid-cols-1 sm:grid-cols-2'} items-center justify-start gap-2`}
    >
      {stats.currentAmmoCount !== undefined && (
        <BtnControl
          title="Single Shot"
          icon={<DamageIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentAmmoCount > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: weaponId,
                    stat: 'currentAmmoCount',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentAmmoCount !== undefined &&
        stats.currentMagCount !== undefined &&
        stats.magCapacity !== undefined && (
          <BtnControl
            title="Reload"
            icon={<MagCapacityIcon className="size-8 text-inherit" />}
            mutation={
              stats.currentMagCount > 0 &&
              stats.currentAmmoCount < stats.magCapacity
                ? () => {
                    editItemStat.mutate({
                      itemId: weaponId,
                      stat: 'currentAmmoCount',
                      value: stats.magCapacity - stats.currentAmmoCount,
                    });
                    editItemStat.mutate({
                      itemId: weaponId,
                      stat: 'currentMagCount',
                      value: -1,
                    });
                  }
                : null
            }
          />
        )}
      {stats.currentAmmoCount !== undefined && stats.salvo !== undefined && (
        <BtnControl
          title="Salvo"
          icon={<SalvoIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentAmmoCount >= stats.salvo
              ? () =>
                  editItemStat.mutate({
                    itemId: weaponId,
                    stat: 'currentAmmoCount',
                    value: stats.salvo * -1,
                  })
              : null
          }
        />
      )}
      {stats.currentAmmoCount !== undefined &&
        stats.currentMagCount !== undefined &&
        stats.magCapacity !== undefined &&
        stats.magCount !== undefined && (
          <BtnControl
            title="Refresh"
            icon={<SpareAmmoIcon className="size-8 text-inherit" />}
            mutation={
              stats.currentAmmoCount < stats.magCapacity ||
              stats.currentMagCount < stats.magCount - 1
                ? () => {
                    editItemStat.mutate({
                      itemId: weaponId,
                      stat: 'currentAmmoCount',
                      value: stats.magCapacity - stats.currentAmmoCount,
                    });
                    editItemStat.mutate({
                      itemId: weaponId,
                      stat: 'currentMagCount',
                      value: stats.magCount - stats.currentMagCount,
                    });
                  }
                : null
            }
          />
        )}
    </div>
  );
};

export const ArmorControls = ({
  armorId,
  stats,
  cardType,
}: {
  armorId: number;
  stats: Stats;
  cardType?: 'small' | 'large';
}) => {
  const editItemStat = useItemStatMutation();

  return (
    <div
      className={`${cardType === 'small' ? 'flex flex-col' : 'col-span-2 grid grid-cols-1 sm:grid-cols-2'} items-center justify-start gap-2`}
    >
      {stats.currentBlock !== undefined && (
        <BtnControl
          title="Block"
          icon={<BlockIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentBlock > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: armorId,
                    stat: 'currentBlock',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentBlock !== undefined && stats.block !== undefined && (
        <BtnControl
          title="Repair"
          icon={<HullIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentBlock < stats.block
              ? () =>
                  editItemStat.mutate({
                    itemId: armorId,
                    stat: 'currentBlock',
                    value: stats.block - stats.currentBlock,
                  })
              : null
          }
        />
      )}
      {stats.currentPower !== undefined && (
        <BtnControl
          title="Activate"
          icon={<LightningIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPower > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: armorId,
                    stat: 'currentPower',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentPower !== undefined && stats.power !== undefined && (
        <BtnControl
          title="Use Power Cell"
          icon={<PowerIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPower < stats.power
              ? () =>
                  editItemStat.mutate({
                    itemId: armorId,
                    stat: 'currentPower',
                    value:
                      stats.power - stats.currentPower < 3
                        ? stats.power - stats.currentPower
                        : 3,
                  })
              : null
          }
        />
      )}
    </div>
  );
};

export const CyberneticControls = ({
  cyberneticId,
  stats,
  cardType,
}: {
  cyberneticId: number;
  stats: Stats;
  cardType?: 'small' | 'large';
}) => {
  const editItemStat = useItemStatMutation();

  return (
    <div
      className={`${cardType === 'small' ? 'flex flex-col' : 'col-span-2 grid grid-cols-1 sm:grid-cols-2'} items-center justify-start gap-2`}
    >
      {stats.currentPower !== undefined && (
        <BtnControl
          title="Activate"
          icon={<LightningIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPower > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: cyberneticId,
                    stat: 'currentPower',
                    value: -1,
                  })
              : null
          }
        />
      )}

      {stats.currentPower !== undefined && stats.power !== undefined && (
        <BtnControl
          title="Use Power Cell"
          icon={<PowerIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPower < stats.power
              ? () =>
                  editItemStat.mutate({
                    itemId: cyberneticId,
                    stat: 'currentPower',
                    value:
                      stats.power - stats.currentPower < 3
                        ? stats.power - stats.currentPower
                        : 3,
                  })
              : null
          }
        />
      )}
    </div>
  );
};

export const VehicleControls = ({
  stats,
  vehicleId,
  cardType,
}: {
  stats: Stats;
  vehicleId: number;
  cardType?: 'small' | 'large';
}) => {
  const editItemStat = useItemStatMutation();

  return (
    <div
      className={`${cardType === 'small' ? 'flex flex-col' : 'col-span-2 grid grid-cols-1 sm:grid-cols-2'} items-center justify-start gap-2`}
    >
      {stats.currentHull !== undefined && (
        <BtnControl
          title="Take Damage"
          icon={<DamageIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentHull > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: vehicleId,
                    stat: 'currentHull',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentHull !== undefined && stats.hull && (
        <BtnControl
          title="Repair Hull"
          icon={<HullIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentHull < stats.hull
              ? () =>
                  editItemStat.mutate({
                    itemId: vehicleId,
                    stat: 'currentHull',
                    value: stats.hull - stats.currentHull,
                  })
              : null
          }
        />
      )}
      {stats.currentCargo !== undefined && (
        <BtnControl
          title="Unload Cargo"
          icon={<CargoIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentCargo > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: vehicleId,
                    stat: 'currentCargo',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentCargo !== undefined && stats.cargo && (
        <BtnControl
          title="Load Cargo"
          icon={<InventoryIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentCargo < stats.cargo
              ? () =>
                  editItemStat.mutate({
                    itemId: vehicleId,
                    stat: 'currentCargo',
                    value: 1,
                  })
              : null
          }
        />
      )}
      {stats.currentPass !== undefined && (
        <BtnControl
          title="Unload Passengers"
          icon={<PassIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPass > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: vehicleId,
                    stat: 'currentPass',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentPass !== undefined && stats.pass && (
        <BtnControl
          title="Load Passengers"
          icon={<PassIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPass < stats.pass
              ? () =>
                  editItemStat.mutate({
                    itemId: vehicleId,
                    stat: 'currentPass',
                    value: 1,
                  })
              : null
          }
        />
      )}
    </div>
  );
};

export const DroneControls = ({
  stats,
  droneId,
  cardType,
}: {
  stats: Stats;
  droneId: number;
  cardType?: 'small' | 'large';
}) => {
  const editItemStat = useItemStatMutation();

  return (
    <div
      className={`${cardType === 'small' ? 'flex flex-col' : 'col-span-2 grid grid-cols-1 sm:grid-cols-2'} items-center justify-start gap-2`}
    >
      {stats.currentHull !== undefined && (
        <BtnControl
          title="Take Damage"
          icon={<DamageIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentHull > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: droneId,
                    stat: 'currentHull',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentHull !== undefined && stats.hull !== undefined && (
        <BtnControl
          title="Repair Drone"
          icon={<HullIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentHull < stats.hull
              ? () =>
                  editItemStat.mutate({
                    itemId: droneId,
                    stat: 'currentHull',
                    value: stats.hull - stats.currentHull,
                  })
              : null
          }
        />
      )}
      {stats.currentPower !== undefined && (
        <BtnControl
          title="Activate"
          icon={<LightningIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPower > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: droneId,
                    stat: 'currentPower',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentPower !== undefined && stats.power !== undefined && (
        <BtnControl
          title="Use Power Cell"
          icon={<PowerIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPower < stats.power
              ? () =>
                  editItemStat.mutate({
                    itemId: droneId,
                    stat: 'currentPower',
                    value:
                      stats.power - stats.currentPower < 3
                        ? stats.power - stats.currentPower
                        : 3,
                  })
              : null
          }
        />
      )}
    </div>
  );
};

export const ItemControls = ({
  itemId,
  stats,
  cardType,
}: {
  itemId: number;
  stats: Stats;
  cardType?: 'small' | 'large';
}) => {
  const editItemStat = useItemStatMutation();

  return (
    <div
      className={`${cardType === 'small' ? 'flex flex-col' : 'col-span-2 grid grid-cols-1 sm:grid-cols-2'} items-center justify-start gap-2`}
    >
      {stats.currentPower !== undefined && (
        <BtnControl
          title="Activate"
          icon={<LightningIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPower > 0
              ? () =>
                  editItemStat.mutate({
                    itemId: itemId,
                    stat: 'currentPower',
                    value: -1,
                  })
              : null
          }
        />
      )}
      {stats.currentPower !== undefined && stats.power !== undefined && (
        <BtnControl
          title="Recharge"
          icon={<PowerIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentPower < stats.power
              ? () =>
                  editItemStat.mutate({
                    itemId: itemId,
                    stat: 'currentPower',
                    value:
                      stats.power - stats.currentPower < 3
                        ? stats.power - stats.currentPower
                        : 3,
                  })
              : null
          }
        />
      )}
    </div>
  );
};
