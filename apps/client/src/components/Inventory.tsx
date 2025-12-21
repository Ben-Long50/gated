import Loading from './Loading';
import Items from './Items';
import { useLocation, useParams } from 'react-router-dom';
import useInventory from 'src/hooks/useInventory';
import useCharacters from 'src/hooks/useCharacters';
import useCharactersQuery from 'src/hooks/useCharactersQuery/useCharactersQuery';

const Inventory = () => {
  const { category } = useParams();

  // const { inventory } = useInventory(activeCharacter?.characterInventory);

  if (isLoading) return <Loading />;

  const itemList = inventory[category];

  return (
    <div className="flex w-full max-w-6xl flex-col gap-8">
      <Items itemList={itemList} key={activeCharacter?.id + ' ' + category} />
    </div>
  );
};

export default Inventory;
