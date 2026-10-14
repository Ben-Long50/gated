import { mdiCartPlus } from '@mdi/js';
import useEditCartMutation from '../hooks/useEditCartMutation/useEditCartMutation';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import IconBtnSmall from './buttons/IconBtnSmall';
import Icon from '@mdi/react';
import { Item } from 'src/types/item';

const CartButton = ({
  characterId,
  item,
  className,
}: {
  characterId: number;
  item: Item;
  className?: string;
}) => {
  const { data: character } = useCharacterQuery(Number(characterId));

  const editCart = useEditCartMutation(
    characterId,
    character?.characterCart?.id,
    item,
  );

  return (
    <div className={`${className}`}>
      <IconBtnSmall
        active={!!characterId}
        tooltip="Add To Cart"
        onClick={() => {
          editCart.mutate({
            itemId: item.id,
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
