import prisma from '../config/database.js';
const characterAuthentication = {
    validateItemDeletePermissions: async (req, res, next) => {
        const itemId = Number(req.params.itemId);
        if (!req.user) {
            return res.status(403).json({ message: 'No user found' });
        }
        if (req.user?.role === 'SUPERADMIN' || req.user?.role === 'ADMIN') {
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
        if (item.characterInventory.character.userId === req.user?.id) {
            return next();
        }
        return res
            .status(401)
            .json({ message: 'You do not have permissions to delete this item' });
    },
};
export default characterAuthentication;
