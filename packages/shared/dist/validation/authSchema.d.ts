import z from 'zod';
export declare const SignUpInput: z.ZodObject<{
    username: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.z.core.$strip>;
export declare const FacebookSignUpInput: z.ZodObject<{
    username: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    facebookId: z.ZodOptional<z.ZodString>;
    profilePicture: z.ZodOptional<z.ZodString>;
    email: z.ZodEmail;
}, z.z.core.$strip>;
export declare const GoogleSignUpInput: z.ZodObject<{
    username: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    googleId: z.ZodOptional<z.ZodString>;
    profilePicture: z.ZodOptional<z.ZodString>;
    email: z.ZodEmail;
}, z.z.core.$strip>;
export declare const SignInInput: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.z.core.$strip>;
export declare const UserUpdateInput: z.ZodObject<{
    username: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodEmail;
}, z.z.core.$strip>;
export type SignUpInput = z.infer<typeof SignUpInput>;
export type FacebookSignUpInput = z.infer<typeof FacebookSignUpInput>;
export type GoogleSignUpInput = z.infer<typeof GoogleSignUpInput>;
export type SignInInput = z.infer<typeof SignInInput>;
export type UserUpdateInput = z.infer<typeof UserUpdateInput>;
