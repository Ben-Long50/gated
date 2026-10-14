import { useMutation, useQueryClient } from '@tanstack/react-query';
import editCart from './editCart';
import { useRef } from 'react';
import { Character } from 'src/types/character';
import { toast } from 'react-toastify';
import { Item } from 'src/types/item';

const useEditCartMutation = (
  characterId: number,
  cartId: number,
  item: Item,
) => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

  return useMutation({
    mutationFn: (formData: { itemId: number; value: number }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateBuffer.current += formData.value;

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;

          const character = await editCart(characterId, cartId, {
            itemId: formData.itemId,
            value: finalValue,
          });
          resolve(character);
        }, 1000);
      });
    },

    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ['character', characterId] });

      const prevCharacterData: Character | undefined = queryClient.getQueryData(
        ['character', characterId],
      );

      const cartItem = prevCharacterData?.characterCart?.items.find(
        (i) => i.item.id === data.itemId,
      );

      if (cartItem) {
        if (cartItem.quantity + data.value <= 0) {
          queryClient.setQueryData(
            ['character', characterId],
            (prev: Character) => ({
              ...prev,
              characterCart: {
                ...prev.characterCart,
                items: prev.characterCart?.items?.filter(
                  (i) => i.item.id !== data.itemId,
                ),
              },
            }),
          );

          toast.success(`Removed ${item.name} from cart`);
        } else {
          queryClient.setQueryData(
            ['character', characterId],
            (prev: Character) => ({
              ...prev,
              characterCart: {
                ...prev.characterCart,
                items: prev.characterCart?.items?.map((i) =>
                  i.item.id === data.itemId
                    ? {
                        ...i,
                        quantity: cartItem.quantity + data.value,
                      }
                    : i,
                ),
              },
            }),
          );

          toast.success(`Added ${item.name} to cart`);
        }
      } else {
        queryClient.setQueryData(
          ['character', characterId],
          (prev: Character) => ({
            ...prev,
            characterCart: {
              ...prev.characterCart,
              items: [
                ...prev.characterCart?.items,
                {
                  characterCartId: prev.characterCartId,
                  quantity: data.value,
                  itemId: data.itemId,
                  item,
                },
              ],
            },
          }),
        );

        toast.success(`Added item to cart`);
      }

      return { prevCharacterData };
    },

    onSuccess: (data) => {
      queryClient.setQueryData(['character', characterId], data.character);
    },
    onError: (data, __, context) => {
      queryClient.setQueryData(
        ['character', characterId],
        context?.prevCharacterData,
      );
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useEditCartMutation;
