import { Prisma } from '@prisma/client';

type LinkReferencePlaylaod = Prisma.ItemLinkReferenceGetPayload<{
  include: {
    items: { select: { id: true } };
    actions: { select: { id: true } };
  };
}> | null;
