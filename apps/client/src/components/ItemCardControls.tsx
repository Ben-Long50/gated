import BtnControl from './buttons/BtnControl';
import { useParams } from 'react-router-dom';
import useEditAmmoMutation from 'src/hooks/item stat hooks/useEditAmmoMutation/useEditAmmoMutation';
import useReloadAmmoMutation from 'src/hooks/item stat hooks/useReloadAmmoMutation/useReloadAmmoMutation';
import useRefreshAmmoMutation from 'src/hooks/item stat hooks/useRefreshAmmoMutation/useRefreshAmmoMutation';
import useEditBlockMutation from 'src/hooks/item stat hooks/useEditBlockMutation/useEditBlockMutation';
import useEditHullMutation from 'src/hooks/item stat hooks/useEditHullMutation/useEditHullMutation';
import useEditCargoMutation from 'src/hooks/item stat hooks/useEditCargoMutation/useEditCargoMutation';
import useEditPassMutation from 'src/hooks/item stat hooks/useEditPassMutation/useEditPassMutation';
import useEditPowerMutation from 'src/hooks/item stat hooks/useEditPowerMutation/useEditPowerMutation';
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

export const WeaponControls = ({
  stats,
  weaponId,
}: {
  stats: Stats;
  weaponId: number;
}) => {
  const editCurrentAmmo = useEditAmmoMutation(weaponId);
  const reloadAmmo = useReloadAmmoMutation(weaponId);
  const refreshAmmo = useRefreshAmmoMutation(weaponId);

  return (
    <div className="col-span-2 grid grid-cols-1 items-center justify-start gap-2 sm:grid-cols-2 sm:gap-4">
      {stats.currentAmmoCount !== undefined && (
        <BtnControl
          title="Single Shot"
          icon={<DamageIcon className="size-8 text-inherit" />}
          mutation={stats.currentAmmoCount > 0 ? editCurrentAmmo : null}
          value={-1}
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
                ? reloadAmmo
                : null
            }
          />
        )}
      {stats.currentAmmoCount !== undefined && stats.salvo !== undefined && (
        <BtnControl
          title="Salvo"
          icon={<SalvoIcon className="size-8 text-inherit" />}
          mutation={
            stats.currentAmmoCount >= stats.salvo ? editCurrentAmmo : null
          }
          value={-stats.salvo}
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
                ? refreshAmmo
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
}: {
  armorId: number;
  stats: Stats;
}) => {
  const editPower = useEditPowerMutation(armorId);
  const editBlock = useEditBlockMutation(armorId);

  return (
    <div className="col-span-2 grid grid-cols-1 items-center justify-start gap-4 sm:grid-cols-2">
      {stats.currentBlock !== undefined && (
        <BtnControl
          title="Block"
          icon={<BlockIcon className="size-8 text-inherit" />}
          mutation={stats.currentBlock > 0 ? editBlock : null}
          value={-1}
        />
      )}
      {stats.currentBlock !== undefined && stats.block !== undefined && (
        <BtnControl
          title="Repair"
          icon={<HullIcon className="size-8 text-inherit" />}
          mutation={stats.currentBlock < stats.block ? editBlock : null}
          value={stats.block - stats.currentBlock}
        />
      )}
      {stats.currentPower !== undefined && (
        <BtnControl
          title="Activate"
          icon={<LightningIcon className="size-8 text-inherit" />}
          mutation={stats.currentPower > 0 ? editPower : null}
          value={-1}
        />
      )}
      {stats.currentPower !== undefined && stats.power !== undefined && (
        <BtnControl
          title="Use Power Cell"
          icon={<PowerIcon className="size-8 text-inherit" />}
          mutation={stats.currentPower < stats.power ? editPower : null}
          value={
            stats.power - stats.currentPower < 3
              ? stats.power - stats.currentPower
              : 3
          }
        />
      )}
    </div>
  );
};

export const CyberneticControls = ({
  cyberneticId,
  stats,
}: {
  cyberneticId: number;
  stats: Stats;
}) => {
  const editPower = useEditPowerMutation(cyberneticId);

  return (
    <div className="col-span-2 grid grid-cols-1 items-center justify-start gap-4 sm:grid-cols-2">
      {stats.currentPower !== undefined && (
        <BtnControl
          title="Activate"
          icon={<LightningIcon className="size-8 text-inherit" />}
          mutation={stats.currentPower > 0 ? editPower : null}
          value={-1}
        />
      )}

      {stats.currentPower !== undefined && stats.power !== undefined && (
        <BtnControl
          title="Use Power Cell"
          icon={<PowerIcon className="size-8 text-inherit" />}
          mutation={stats.currentPower < stats.power ? editPower : null}
          value={
            stats.power - stats.currentPower < 3
              ? stats.power - stats.currentPower
              : 3
          }
        />
      )}
    </div>
  );
};

export const VehicleControls = ({
  stats,
  vehicleId,
}: {
  stats: Stats;
  vehicleId: number;
}) => {
  const editHull = useEditHullMutation(vehicleId);

  const editCargo = useEditCargoMutation(vehicleId);

  const editPass = useEditPassMutation(vehicleId);

  return (
    <div className="col-span-2 grid grid-cols-1 items-center justify-start gap-2 sm:grid-cols-2 sm:gap-4">
      {stats.currentHull !== undefined && (
        <BtnControl
          title="Take Damage"
          icon={<DamageIcon className="size-8 text-inherit" />}
          mutation={stats.currentHull > 0 ? editHull : null}
          value={-1}
        />
      )}
      {stats.currentHull !== undefined && stats.hull && (
        <BtnControl
          title="Repair Hull"
          icon={<HullIcon className="size-8 text-inherit" />}
          mutation={stats.currentHull < stats.hull ? editHull : null}
          value={stats.hull - stats.currentHull}
        />
      )}
      {stats.currentCargo !== undefined && (
        <BtnControl
          title="Unload Cargo"
          icon={<CargoIcon className="size-8 text-inherit" />}
          mutation={stats.currentCargo > 0 ? editCargo : null}
          value={-1}
        />
      )}
      {stats.currentCargo !== undefined && stats.cargo && (
        <BtnControl
          title="Load Cargo"
          icon={<InventoryIcon className="size-8 text-inherit" />}
          mutation={stats.currentCargo < stats.cargo ? editCargo : null}
          value={1}
        />
      )}
      {stats.currentPass !== undefined && (
        <BtnControl
          title="Unload Passengers"
          icon={<PassIcon className="size-8 text-inherit" />}
          mutation={stats.currentPass > 0 ? editPass : null}
          value={-1}
        />
      )}
      {stats.currentPass !== undefined && stats.pass && (
        <BtnControl
          title="Load Passengers"
          icon={<PassIcon className="size-8 text-inherit" />}
          mutation={stats.currentPass < stats.pass ? editPass : null}
          value={1}
        />
      )}
    </div>
  );
};

export const DroneControls = ({
  stats,
  droneId,
}: {
  stats: Stats;
  droneId: number;
}) => {
  const editHull = useEditHullMutation(droneId);
  const editPower = useEditPowerMutation(droneId);

  return (
    <div className="col-span-2 grid grid-cols-1 items-center justify-start gap-4 sm:grid-cols-2">
      {stats.currentHull !== undefined && (
        <BtnControl
          title="Take Damage"
          icon={<DamageIcon className="size-8 text-inherit" />}
          mutation={stats.currentHull > 0 ? editHull : null}
          value={-1}
        />
      )}
      {stats.currentHull !== undefined && stats.hull !== undefined && (
        <BtnControl
          title="Repair Drone"
          icon={<HullIcon className="size-8 text-inherit" />}
          mutation={stats.currentHull < stats.hull ? editHull : null}
          value={stats.hull - stats.currentHull}
        />
      )}
      {stats.currentPower !== undefined && (
        <BtnControl
          title="Activate"
          icon={<LightningIcon className="size-8 text-inherit" />}
          mutation={stats.currentPower > 0 ? editPower : null}
          value={-1}
        />
      )}
      {stats.currentPower !== undefined && stats.power !== undefined && (
        <BtnControl
          title="Use Power Cell"
          icon={<PowerIcon className="size-8 text-inherit" />}
          mutation={stats.currentPower < stats.power ? editPower : null}
          value={
            stats.power - stats.currentPower < 3
              ? stats.power - stats.currentPower
              : 3
          }
        />
      )}
    </div>
  );
};

export const ItemControls = ({
  itemId,
  stats,
}: {
  itemId: number;
  stats: Stats;
}) => {
  const editPower = useEditPowerMutation(itemId);

  return (
    <div className="col-span-2 grid grid-cols-1 items-center justify-start gap-4 sm:grid-cols-2">
      {stats.currentPower !== undefined && (
        <BtnControl
          title="Activate"
          icon={<LightningIcon className="size-8 text-inherit" />}
          mutation={stats.currentPower > 0 ? editPower : null}
          value={-1}
        />
      )}
      {stats.currentPower !== undefined && stats.power !== undefined && (
        <BtnControl
          title="Recharge"
          icon={<PowerIcon className="size-8 text-inherit" />}
          mutation={stats.currentPower < stats.power ? editPower : null}
          value={
            stats.power - stats.currentPower < 3
              ? stats.power - stats.currentPower
              : 3
          }
        />
      )}
    </div>
  );
};
