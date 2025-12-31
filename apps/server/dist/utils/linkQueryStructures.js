export const includeCharacterInventory = {
    items: {
        include: {
            itemLinkReference: { include: { actions: true, items: true } },
            keywords: { include: { keyword: true } },
        },
    },
    actions: {
        orderBy: { name: 'asc' },
        include: { keywordModifiers: { include: { keyword: true } } },
    },
};
export const includeCharacterCart = {
    items: {
        include: {
            item: {
                include: {
                    itemLinkReference: {
                        include: {
                            items: { orderBy: { name: 'asc' } },
                            actions: { orderBy: { name: 'asc' } },
                        },
                    },
                    characterInventory: {
                        include: {
                            character: { select: { firstName: true, lastName: true } },
                        },
                    },
                },
            },
        },
        orderBy: { item: { name: 'asc' } },
    },
};
export const equipLinked = {
    items: {
        updateMany: {
            where: {},
            data: {
                equipped: true,
            },
        },
    },
    actions: {
        updateMany: {
            where: { itemType: 'passive' },
            data: {
                equipped: true,
            },
        },
    },
};
export const unequipLinked = {
    items: {
        updateMany: {
            where: {},
            data: {
                equipped: false,
            },
        },
    },
    actions: {
        updateMany: {
            where: {},
            data: {
                active: false,
                equipped: false,
            },
        },
    },
};
