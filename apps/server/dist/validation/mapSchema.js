import z from 'zod';
import { Description, Name } from './fieldSchemas.js';
import { MapType } from './enums.js';
const Component = z.lazy(() => z.object({
    name: Name,
    id: z.number().int().nonnegative(),
    imageUrl: z.string().optional(),
    width: z.number().int().nonnegative(),
    height: z.number().int().nonnegative(),
    imageColStart: z.number().int().nonnegative().optional(),
    imageRowStart: z.number().int().nonnegative().optional(),
    mapColStart: z.number().int().nonnegative(),
    mapRowStart: z.number().int().nonnegative(),
    subComponents: z.array(Component),
}));
export const MapInput = z.object({
    id: z.number().int().optional(),
    campaignId: z.number().int().optional(),
    type: MapType,
    draft: z.boolean(),
    name: Name,
    description: Description,
    width: z.number().int().nonnegative(),
    height: z.number().int().nonnegative(),
    baseColor: z.string(),
    layerCount: z.number().int().nonnegative(),
    layers: z.array(z.object({
        name: z.string(),
        id: z.number().int().nonnegative(),
        hidden: z.boolean(),
        componentCount: z.number().int().nonnegative(),
        components: z.array(Component),
    })),
    generatedPictureId: z.number().int().optional(),
});
