import { mdiCartPlus } from '@mdi/js';
import useEditCartMutation from '../hooks/useEditCartMutation/useEditCartMutation';
import BtnIcon from './buttons/BtnIcon';
import { useParams } from 'react-router-dom';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';

const CartButton = ({ itemId }: { itemId: number }) => {
  const { characterId } = useParams();

  const { data: character } = useCharacterQuery(Number(characterId));

  const editCart = useEditCartMutation(
    character?.id,
    character?.characterCart?.id,
  );

  return (
    <BtnIcon
      path={mdiCartPlus}
      active={!!characterId}
      onClick={() => {
        editCart.mutate({
          itemId,
          value: 1,
        });
      }}
    />
  );
};

export default CartButton;
