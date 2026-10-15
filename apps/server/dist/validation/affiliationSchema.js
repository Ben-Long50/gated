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
    .refine((data) => {
    var _a, _b, _c, _d, _e, _f;
    const total = ((_b = (_a = data.factionIds) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) +
        ((_d = (_c = data.gangIds) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) +
        ((_f = (_e = data.characterIds) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0);
    return total === 2;
}, {
    error: 'You may only have two entities associated with a single affiliation',
    path: ['factionIds'],
});
