import BtnAuth from './buttons/BtnAuth';
import { useContext } from 'react';
import Icon from '@mdi/react';
import { mdiCartOutline } from '@mdi/js';
import { useNavigate, useParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import Divider from './Divider';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useParts from 'src/hooks/useParts';
import Inventory from './Inventory';
import { Item } from 'src/types/item';

const Shop = ({ itemList }: { itemList: Item[] }) => {
  const { accentPrimary } = useContext(ThemeContext);
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { parts } = useParts();

  const { filteredCharacter: character } = useCharacter(Number(characterId));

  const cartLength = Object.values(character?.characterCart || {})
    .filter(Array.isArray)
    .flat()
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="flex items-center justify-between gap-8">
        <button
          className="group relative"
          onClick={() =>
            navigate(parts.includes('modal') ? 'cart' : 'modal/cart')
          }
        >
          <Icon
            className="group-hover:text-accent text-secondary timing size-12 shrink-0 p-2"
            path={mdiCartOutline}
          />
          <p
            className="shadow-color absolute right-0 top-0 flex h-6 min-w-6 items-center justify-center rounded-full pt-0.5 text-center text-base font-semibold shadow-md dark:text-gray-950"
            style={{ backgroundColor: accentPrimary }}
          >
            {cartLength}
          </p>
        </button>
        <p>{character?.profits.toLocaleString()} p</p>
      </div>
      {!characterId && (
        <BtnAuth
          onClick={() =>
            navigate(parts.includes('modal') ? 'bulk' : 'modal/bulk')
          }
        >
          Bulk Item Select
        </BtnAuth>
      )}
      <Divider />
      <Inventory itemList={itemList} />
    </>
  );
};

export default Shop;
