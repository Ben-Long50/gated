import prisma from '../config/database.js';
import { characterInclude } from './characterServices.js';
const cartServices = {
    editCartItem: async (characterId, cartId, itemId, value) => {
        const cartItem = await prisma.cartItemRelation.findUnique({
            where: { characterCartId_itemId: { characterCartId: cartId, itemId } },
        });
        let remove = false;
        if (cartItem && cartItem.quantity + value === 0) {
            remove = true;
        }
        try {
            const character = await prisma.character.update({
                where: { id: characterId },
                data: {
                    characterCart: {
                        update: {
                            items: remove
                                ? {
                                    delete: {
                                        characterCartId_itemId: {
                                            characterCartId: cartId,
                                            itemId,
                                        },
                                    },
                                }
                                : {
                                    upsert: {
                                        where: {
                                            characterCartId_itemId: {
                                                characterCartId: cartId,
                                                itemId,
                                            },
                                        },
                                        update: {
                                            quantity: { increment: value },
                                        },
                                        create: {
                                            itemId,
                                            quantity: value,
                                        },
                                    },
                                },
                        },
                    },
                },
                include: characterInclude,
            });
            return character;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to add item to cart');
        }
    },
};
export default cartServices;
