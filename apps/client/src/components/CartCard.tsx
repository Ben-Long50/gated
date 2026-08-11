import { Item } from 'src/types/item';
import { mdiMinus, mdiPlus, mdiTrashCanOutline } from '@mdi/js';
import useEditCartMutation from 'src/hooks/useEditCartMutation/useEditCartMutation';
import { PictureCard } from './PictureCard';
import IconBtnSmall from './buttons/IconBtnSmall';
import Icon from '@mdi/react';
import constructName from 'src/utils/constructName';

const CartCard = ({
  item,
  quantity,
  characterId,
  cartId,
}: {
  item: Item;
  quantity: number;
  characterId: number;
  cartId: number;
}) => {
  const editCart = useEditCartMutation(Number(characterId), cartId);

  const shopName = item?.characterInventory
    ? constructName(item?.characterInventory.character) + "'s Shop"
    : 'Global Shop';

  return (
    <div className="flex h-full w-full items-center justify-between gap-8">
      <PictureCard className="max-w-48" publicId={item.picture.publicId} />
      <div className="flex grow flex-col items-start justify-center gap-1">
        <h3>{item?.name}</h3>
        <p className="text-tertiary">({shopName})</p>
      </div>
      <div className="ml-auto mr-8 flex items-center gap-4">
        <IconBtnSmall
          onClick={() => {
            if (cartId) {
              editCart.mutate({
                itemId: item.id,
                value: -1,
              });
            }
          }}
        >
          <Icon path={mdiMinus} />
        </IconBtnSmall>
        <p className="text-center">Qty. {quantity}</p>
        <IconBtnSmall
          onClick={() => {
            if (cartId) {
              editCart.mutate({
                itemId: item.id,
                value: 1,
              });
            }
          }}
        >
          <Icon path={mdiPlus} />
        </IconBtnSmall>
      </div>
      {item.price ? (
        <p className="text-2xl">{item?.price * quantity} p</p>
      ) : (
        <p>N/A</p>
      )}
      <IconBtnSmall
        onClick={() => {
          if (cartId) {
            editCart.mutate({
              itemId: item.id,
              value: 1,
            });
          }
        }}
      >
        <Icon path={mdiTrashCanOutline} />
      </IconBtnSmall>
    </div>
  );
};

export default CartCard;
