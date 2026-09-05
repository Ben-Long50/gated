import { Prisma } from '@prisma/client';

export const includeCharacterInventory: Prisma.CharacterInventoryInclude = {
  items: {
    include: {
      linkedActions: true,
      linkedItems: true,
      keywords: { include: { keyword: true } },
    },
  },
};

export const includeCharacterCart: Prisma.CharacterCartInclude = {
  items: {
    include: {
      item: {
        include: {
          linkedItems: { orderBy: { name: 'asc' } },
          linkedActions: { orderBy: { name: 'asc' } },
          characterInventory: {
            include: {
              character: { select: { name: true, title: true } },
            },
          },
        },
      },
    },
    orderBy: { item: { name: 'asc' } },
  },
};
