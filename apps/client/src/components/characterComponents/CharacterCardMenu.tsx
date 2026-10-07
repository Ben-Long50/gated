import { useLocation, useNavigate } from 'react-router-dom';
import { Character } from 'src/types/character';
import CharacterIcon from '../icons/CharacterIcon';
import EquipmentIcon from '../icons/EquipmentIcon';
import Menu from './Menu';
import ConditionIcon from '../icons/ConditionIcon';
import InventoryIcon from '../icons/InventoryIcon';
import ShopIcon from '../icons/ShopIcon';

const CharacterCardMenu = ({ character }: { character: Character }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const path = parts.includes('characters') ? 'modal/' : 'characters/modal/';

  if (!character) {
    return;
  }

  return (
    <Menu>
      <button onClick={() => navigate(`${path}${character.id}`)}>
        <CharacterIcon className="size-6" />
        Character Sheet
      </button>
      <button onClick={() => navigate(`${path}${character.id}/equipment`)}>
        <EquipmentIcon className="size-6" /> Equipment
      </button>
      <button onClick={() => navigate(`${path}${character.id}/inventory`)}>
        <InventoryIcon className="size-6" /> Inventory
      </button>
      <button onClick={() => navigate(`${path}${character.id}/conditions`)}>
        <ConditionIcon className="size-6" /> Conditions
      </button>
      {character?.npcTypes.includes('shop') && (
        <button onClick={() => navigate(`${path}${character.id}/shop`)}>
          <ShopIcon className="size-6" /> Shop
        </button>
      )}
    </Menu>
  );
};

export default CharacterCardMenu;
