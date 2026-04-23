import z from 'zod';

export const AffiliationInput = z
  .object({
    id: z.number().int().optional(),
    campaignId: z.number().int(),
    factionIds: z.array(z.number().int().nonnegative()),
    gangIds: z.array(z.number().int().nonnegative()),
    characterIds: z.array(z.number().int().nonnegative()),
    value: z.number().int().min(-5).max(5),
  })
  .refine(
    (data) => {
      const total =
        (data.factionIds?.length ?? 0) +
        (data.gangIds?.length ?? 0) +
        (data.characterIds?.length ?? 0);

      return total === 2;
    },
    {
      message:
        'You may only have two entities associated with a single affiliation',
      path: ['factionIds'],
    },
  );

export type AffiliationInput = z.infer<typeof AffiliationInput>;
