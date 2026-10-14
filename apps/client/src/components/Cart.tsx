import Loading from './Loading';
import BtnRect from './buttons/BtnRect';
import CartCard from './CartCard';
import useClearCartMutation from '../hooks/useClearCartMutation/useClearCartMutation';
import useCompletePurchaseMutation from '../hooks/useCompletePurchaseMutation/useCompletePurchaseMutation';
import { useParams } from 'react-router-dom';
import { Character } from 'src/types/character';
import ArrowHeader3 from './ArrowHeader3';
import useCharacter from 'src/hooks/useCharacter';
import Divider from './Divider';
import BtnAuth from './buttons/BtnAuth';

const Cart = ({ character }: { character?: Character }) => {
  const { characterId } = useParams();

  const { filteredCharacter } = useCharacter(Number(characterId));

  const characterObj = character || filteredCharacter;

  const clearCart = useClearCartMutation(
    characterObj?.id,
    characterObj?.characterCart?.id,
  );

  const completePurchase = useCompletePurchaseMutation(
    characterObj?.id,
    characterObj?.characterInventory?.id,
  );

  const totalPrice = characterObj
    ? Object.values(characterObj?.characterCart?.items).reduce(
        (sum, itemReference) =>
          itemReference.item.price
            ? sum + itemReference.item.price * itemReference.quantity
            : sum,
        0,
      )
    : 0;

  return (
    <>
      <h1>Cart</h1>
      {characterObj?.characterCart.items.map((itemReference) => {
        return (
          <CartCard
            key={itemReference.id}
            item={itemReference.item}
            quantity={itemReference.quantity}
            characterId={characterObj?.id}
            cartId={itemReference.characterCartId}
          />
        );
      })}
      <Divider />
      <div className="flex w-full items-center justify-between gap-8">
        <ArrowHeader3 title="Cart Total" />
        <div className="flex items-center gap-4">
          <p className="ml-auto text-2xl">{totalPrice.toLocaleString()} p</p>
          <p
            className={`${characterObj?.profits - totalPrice < 0 && 'text-error'} text-base`}
          >
            ({(characterObj?.profits - totalPrice).toLocaleString()} p)
          </p>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <BtnAuth className="min-w-64" onClick={() => clearCart.mutate()}>
          {clearCart.isPending ? (
            <Loading className="text-accent" size={1.15} />
          ) : (
            'Clear Cart'
          )}
        </BtnAuth>
        <BtnRect
          ariaLabel="Complete purchase"
          type="submit"
          className="group min-w-64 self-end"
          onClick={() => {
            if (completePurchase.isPending) return;
            completePurchase.mutate();
          }}
        >
          {completePurchase.isPending ? (
            <Loading
              className="group-hover:text-accent dark:text-gray-900"
              size={1.15}
            />
          ) : (
            'Complete purchase'
          )}
        </BtnRect>
      </div>
    </>
  );
};

export default Cart;
