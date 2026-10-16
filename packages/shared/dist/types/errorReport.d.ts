import { User } from './user.js';
export type ErrorReport = {
    id: number;
    createdAt: Date;
    title: string;
    content: string;
    userId: number;
    user: User;
};
