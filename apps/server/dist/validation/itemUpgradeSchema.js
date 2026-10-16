import z from 'zod';
import prisma from '../config/database.js';
import { ItemUpgradeBaseInput, StatsSchemaByItemType, } from '@gated/shared/validation';
export const ItemUpgradeInput = ItemUpgradeBaseInput.superRefine(async (data, ctx) => {
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
    const mergedShape = item.itemTypes.reduce((acc, type) => ({ ...acc, ...StatsSchemaByItemType[type].shape }), {});
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
