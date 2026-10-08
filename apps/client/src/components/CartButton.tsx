import { mdiCartPlus } from '@mdi/js';
import useEditCartMutation from '../hooks/useEditCartMutation/useEditCartMutation';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import IconBtnSmall from './buttons/IconBtnSmall';
import Icon from '@mdi/react';

const CartButton = ({
  characterId,
  itemId,
  className,
}: {
  characterId: number;
  itemId: number;
  className?: string;
}) => {
  const { data: character } = useCharacterQuery(Number(characterId));

  const editCart = useEditCartMutation(
    characterId,
    character?.characterCart?.id,
  );

  return (
    <div className={`${className}`}>
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
    </div>
  );
};

export default CartButton;
