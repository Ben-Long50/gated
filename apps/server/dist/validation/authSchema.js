import z from 'zod';
import { Name } from './fieldSchemas.js';
export const SignUpInput = z
    .object({
    username: Name,
    firstName: Name,
    lastName: Name,
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export const FacebookSignUpInput = z.object({
    username: Name,
    firstName: Name,
    lastName: Name,
    facebookId: z.string().min(1).optional(),
    profilePicture: z.string().min(1).optional(),
    email: z.email(),
});
export const GoogleSignUpInput = z.object({
    username: Name,
    firstName: Name,
    lastName: Name,
    googleId: z.string().min(1).optional(),
    profilePicture: z.string().min(1).optional(),
    email: z.email(),
});
export const SignInInput = z
    .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export const UserUpdateInput = z.object({
    username: Name,
    firstName: Name,
    lastName: Name,
    email: z.email(),
});
