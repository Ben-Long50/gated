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
            const picture = await userServices.addUserGeneratedPicture(req.body.picture, req.user.id);
            res
                .status(200)
                .json({ picture, message: 'Successfully generated and saved image' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    updateUserRole: async (req, res) => {
        try {
            const validatedRole = UserRole.parse(req.body.role);
            await userServices.updateUserRole(validatedRole, Number(req.params.userId));
            res
                .status(200)
                .json({ message: 'Successfully updated account information' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default userController;
