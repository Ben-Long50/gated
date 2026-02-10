import constructName from 'src/utils/constructName';
import CharacterIcon from '../icons/CharacterIcon';
import LinkListSidebar from './LinkListSidebar';
import SubLinkSidebar from './SubLinkSidebar';
import Loading from '../Loading';
import LinkSidebar from './LinkSidebar';
import CharacterPictureRound from '../CharacterPictureRound';
import { useParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import InventoryIcon from '../icons/InventoryIcon';
import EquipmentIcon from '../icons/EquipmentIcon';
import DroneIcon from '../icons/DroneIcon';
import VehicleIcon from '../icons/VehicleIcon';

const CharacterLinks = () => {
  const { characterId } = useParams();

  const { filteredCharacter: character, isLoading } = useCharacter(
    Number(characterId),
  );

  if (isLoading) {
    return <Loading size={1.5} />;
  }

  return (
    <>
      <LinkSidebar
        title="Character Sheet"
        icon={
          <CharacterIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        path={`/glam/characters/${character?.id}`}
      />
      <LinkSidebar
        title="Equipment"
        icon={
          <EquipmentIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        path={`/glam/characters/${character?.id}/equipment`}
      />
      <LinkSidebar
        title="Drones"
        icon={
          <DroneIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        path={`/glam/characters/${character?.id}/drones`}
      />
      <LinkSidebar
        title="Vehicles"
        icon={
          <VehicleIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        path={`/glam/characters/${character?.id}/vehicles`}
      />
      <LinkSidebar
        title="Inventory"
        icon={
          <InventoryIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        path={`/glam/characters/${character?.id}/inventory`}
      />
    </>
  );
};

export default CharacterLinks;
