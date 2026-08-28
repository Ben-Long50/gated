var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import bcrypt from 'bcryptjs';
import userServices from '../services/userServices.js';
import { SignUpInput, UserUpdateInput } from '../validation/authSchema.js';
import { UserRole } from '../validation/enums.js';
import handleControllerError from './handleControllerError.js';
import z from 'zod';
const userController = {
    getAuthenticatedUser: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('User authentication failed');
            }
            const user = await userServices.getAuthenticatedUser(req.user.id);
            if (!user) {
                throw new Error('Failed to find user');
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    },
    getBatchUsers: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const userIds = req.query.ids.split(',').map(Number);
            const users = await userServices.getBatchUsers(userIds);
            res.status(200).json(users);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getUsersByUsernameQuery: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ error: 'You must be signed in to search users' });
                return;
            }
            const query = req.query.nameQuery;
            const users = await userServices.getUsersByUsernameQuery(query);
            res.status(200).json(users);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await userServices.getUserById(Number(req.params.userId));
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createUser: async (req, res) => {
        try {
            const validatedUser = SignUpInput.parse(req.body);
            const { confirmPassword, password } = validatedUser, data = __rest(validatedUser, ["confirmPassword", "password"]);
            const hashedPassword = await bcrypt.hash(password, 10);
            await userServices.createUser(Object.assign(Object.assign({}, data), { password: hashedPassword }));
            res.status(200).json({ message: 'Account creation successful' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    updateUser: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .send(401)
                    .json({ message: 'You must be signed in to complete this user' });
                return;
            }
            const validatedUser = UserUpdateInput.parse(req.body);
            await userServices.updateUser(validatedUser, req.user.id);
            res
                .status(200)
                .json({ message: 'Successfully updated account information' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    addUserGeneratedPicture: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .send(401)
                    .json({ message: 'You must be signed in to complete this user' });
                return;
            }
            const { id: userId } = req.user;
            if (req.body.pictures) {
                const pictures = await userServices.addUserGeneratedPicture(req.body.pictures, req.body.prompt, req.body.type, userId);
                res.status(200).json({
                    pictures,
                    message: 'Successfully generated and saved images',
                });
                return;
            }
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteUnusedGeneratedPictures: async (req, res) => {
        var _a;
        try {
            if (!req.user) {
                throw new Error('Failed to find user');
            }
            const count = await userServices.deleteUnusedGeneratedPictures(req.user.id, req.body.type, (_a = req.body.count) !== null && _a !== void 0 ? _a : 1);
            res.status(200).json({
                message: `Successfully deleted ${count} oldest unused image(s)`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    updateUserRoles: async (req, res) => {
        try {
            const UserRoleInput = z.object({
                id: z.number().int().optional(),
                role: UserRole,
            });
            const validatedRoles = req.body.map((user) => UserRoleInput.parse(user));
            await userServices.updateUserRoles(validatedRoles);
            res.status(200).json({ message: 'Successfully updated user roles' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default userController;
