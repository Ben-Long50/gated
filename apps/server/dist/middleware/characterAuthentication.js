import prisma from '../config/database.js';
const characterAuthentication = {
    validateItemDeletePermissions: async (req, res, next) => {
        var _a, _b, _c;
        const itemId = Number(req.params.itemId);
        if (!req.user) {
            return res.status(403).json({ message: 'No user found' });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'SUPERADMIN' || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'ADMIN') {
            return next();
        }
        const item = await prisma.item.findUnique({
            where: { id: itemId },
            select: {
                characterInventory: {
                    select: { character: { select: { userId: true } } },
                },
            },
        });
        if (!item) {
            return res.status(400).json({
                message: 'Item not found',
            });
        }
        if (!item.characterInventory || !item.characterInventory.character) {
            return res.status(400).json({
                message: 'You cannot delete items that do not belong to a character inventory',
            });
        }
        if (item.characterInventory.character.userId === ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id)) {
            return next();
        }
        return res
            .status(401)
            .json({ message: 'You do not have permissions to delete this item' });
    },
};
export default characterAuthentication;
