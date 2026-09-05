import z from 'zod';
import { Description, ItemStats, Name } from './fieldSchemas.js';
import { ItemType, Rarity } from './enums.js';
import prisma from '../config/database.js';

export const ItemInput = z
  .object({
    id: z.number().int().optional(),
    name: Name,
    itemTypes: z.array(ItemType).min(1),
    rarity: Rarity,
    grade: z.number().int().min(1).nonnegative(),
    description: Description,
    price: z.number().int().nonnegative().optional().nullable(),
    stats: ItemStats,
    generatedPictureId: z.number().int().nullish(),
    itemIds: z.array(z.number().int()).optional(),
    actionIds: z.array(z.number().int()).optional(),
    keywords: z.array(
      z.object({
        keywordId: z.number().int().nonnegative(),
        value: z.number().int().nonnegative().nullish(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const mergedShape = data.itemTypes.reduce<z.ZodRawShape>(
      (acc, type) => ({ ...acc, ...StatsSchemaByItemType[type].shape }),
      {},
    );

    const mergedSchema = z.object(mergedShape).strict();

    const result = mergedSchema.safeParse(data.stats);

    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ['stats', ...issue.path],
        });
      }
    }

    if (data.itemIds && data.itemIds.length > 0 && !result.data?.slots) {
      ctx.addIssue({
        code: 'custom',
        path: ['itemIds'],
        message:
          'Linked Items are only available to Vehicles and Drones. The number of Linked Items must be less than or equal to the available Slot stat.',
      });
    }
  });

export const ItemUpgradeInput = z
  .object({
    id: z.number().int(),
    name: Name,
    grade: z.number().int().min(1),
    description: Description,
    generatedPictureId: z.number().int().nullish(),
    upgradePrice: z.number().int().nonnegative(),
    modifiedStats: ItemStats,
    keywords: z.array(
      z.object({
        keywordId: z.number().int().nonnegative(),
        value: z.number().int().nonnegative().optional(),
      }),
    ),
    characterId: z.number().int().nonnegative(),
  })
  .superRefine(async (data, ctx) => {
    const item = await prisma.item.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!item) {
      ctx.addIssue({
        code: 'custom',
        path: ['modifiedStats'],
        message: 'Previous item not found',
      });

      return;
    }

    const mergedShape = item.itemTypes.reduce<z.ZodRawShape>(
      (acc, type) => ({ ...acc, ...StatsSchemaByItemType[type].shape }),
      {},
    );

    const mergedSchema = z.object(mergedShape).strict();

    const result = await mergedSchema.safeParseAsync(data.modifiedStats);

    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ['modifiedStats', ...issue.path],
        });
      }
    }
  });

export type ItemInput = z.infer<typeof ItemInput>;

export type ItemUpgradeInput = z.infer<typeof ItemUpgradeInput>;

export const WeaponStats = z.object({
  damage: z.number().int().nonnegative().optional(),
  sanityDamage: z.number().int().nonnegative().optional(),
  salvo: z.number().int().nonnegative().optional(),
  flurry: z.number().int().nonnegative().optional(),
  range: z.number().int().nonnegative().optional(),
  magCapacity: z.number().int().nonnegative().optional(),
  currentAmmoCount: z.number().int().nonnegative().optional(),
  magCount: z.number().int().nonnegative().optional(),
  currentMagCount: z.number().int().nonnegative().optional(),
  power: z.number().int().nonnegative().optional(),
  currentPower: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
});

export const ArmorStats = z.object({
  armor: z.number().int().nonnegative().optional(),
  ward: z.number().int().nonnegative().optional(),
  block: z.number().int().nonnegative().optional(),
  currentBlock: z.number().int().nonnegative().optional(),
  power: z.number().int().nonnegative().optional(),
  currentPower: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
});

export const CyberneticStats = z.object({
  cyber: z.number().int().nonnegative().optional(),
  power: z.number().int().nonnegative().optional(),
  currentPower: z.number().int().nonnegative().optional(),
});

export const MutationStats = z.object({
  block: z.number().int().nonnegative().optional(),
  currentBlock: z.number().int().nonnegative().optional(),
  power: z.number().int().nonnegative().optional(),
});

export const ReusableStats = z.object({
  range: z.number().int().nonnegative().optional(),
  speed: z.number().int().nonnegative().optional(),
  wyrmMoldSlots: z.number().int().nonnegative().optional(),
  wyrmMoldPoints: z.number().int().nonnegative().optional(),
  esotericCharges: z.number().int().nonnegative().optional(),
  currentEsotericCharges: z.number().int().nonnegative().optional(),
  power: z.number().int().nonnegative().optional(),
  currentPower: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
});

export const ConsumableStats = z.object({
  range: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
});

export const VehicleStats = z.object({
  size: z.number().int().nonnegative().optional(),
  speed: z.number().int().nonnegative().optional(),
  agility: z.number().int().nonnegative().optional(),
  hull: z.number().int().nonnegative().optional(),
  currentHull: z.number().int().nonnegative().optional(),
  armor: z.number().int().nonnegative().optional(),
  cargo: z.number().int().nonnegative().optional(),
  currentCargo: z.number().int().nonnegative().optional(),
  pass: z.number().int().nonnegative().optional(),
  currentPass: z.number().int().nonnegative().optional(),
  hangar: z.number().int().nonnegative().optional(),
  currentHangar: z.number().int().nonnegative().optional(),
  slots: z.number().int().nonnegative().optional(),
});

export const DroneStats = z.object({
  hull: z.number().int().nonnegative().optional(),
  currentHull: z.number().int().nonnegative().optional(),
  armor: z.number().int().nonnegative().optional(),
  power: z.number().int().nonnegative().optional(),
  currentPower: z.number().int().nonnegative().optional(),
  speed: z.number().int().nonnegative().optional(),
  slots: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
});

export const ModificationStats = z.object({
  range: z.number().int().nonnegative().optional(),
});

export const StatsSchemaByItemType = {
  weapon: WeaponStats,
  armor: ArmorStats,
  cybernetic: CyberneticStats,
  mutation: MutationStats,
  reusable: ReusableStats,
  consumable: ConsumableStats,
  vehicle: VehicleStats,
  drone: DroneStats,
  modification: ModificationStats,
} as const;
