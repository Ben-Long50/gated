import { mdiCartPlus } from '@mdi/js';
import useEditCartMutation from '../hooks/useEditCartMutation/useEditCartMutation';
import { useParams } from 'react-router-dom';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import IconBtnSmall from './buttons/IconBtnSmall';
import Icon from '@mdi/react';

const CartButton = ({ itemId }: { itemId: number }) => {
  const { characterId } = useParams();

  const { data: character } = useCharacterQuery(Number(characterId));

  const editCart = useEditCartMutation(
    character?.id,
    character?.characterCart?.id,
  );

  return (
    <IconBtnSmall
      active={!!characterId}
      tooltip="Add To Cart"
      onClick={() => {
        editCart.mutate({
          itemId,
          value: 1,
        });
      }}
    >
      <Icon path={mdiCartPlus} />
    </IconBtnSmall>
  );
};

export default CartButton;
