import { UserRole } from '@prisma/client';
import prisma from '../config/database.js';
import {
  FacebookSignUpInput,
  GoogleSignUpInput,
  SignUpInput,
  UserUpdateInput,
} from '../validation/authSchema.js';

const userServices = {
  getAuthenticatedUser: async (userId: number) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          profilePicture: true,
          generatedPictures: { orderBy: { createdAt: 'desc' } },
          characters: {
            select: {
              id: true,
              playerCharacter: true,
              characterInventory: {
                include: {
                  _count: {
                    select: {
                      items: true,
                    },
                  },
                },
              },
            },
            orderBy: { firstName: 'asc' },
          },
          ownerCampaigns: { select: { id: true } },
          playerCampaigns: { select: { id: true } },
          pendingCampaigns: { select: { id: true } },
        },
      });

      return user;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch users');
    }
  },

  getAllUsers: async (query: string, userId: number) => {
    try {
      if (!query) return [];
      const users = await prisma.user.findMany({
        where: {
          id: { not: userId },
          username: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: { id: true, username: true, profilePicture: true, role: true },
        take: 10,
      });

      return users;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch users');
    }
  },

  getBatchUsers: async (userIds: number[]) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          profilePicture: true,
        },
      });

      return users;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch users');
    }
  },

  getUsersByUsernameQuery: async (query: string) => {
    try {
      const users = await prisma.user.findMany({
        where: query
          ? {
              username: {
                contains: query,
                mode: 'insensitive',
              },
            }
          : undefined,
        select: {
          id: true,
          username: true,
          profilePicture: true,
          role: true,
        },
        orderBy: { username: 'asc' },
        take: 20,
      });

      return users;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch users');
    }
  },

  getUserById: async (id: number) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          profilePicture: true,
          characters: { select: { id: true }, orderBy: { firstName: 'asc' } },
          ownerCampaigns: { select: { id: true } },
          playerCampaigns: { select: { id: true } },
          pendingCampaigns: { select: { id: true } },
        },
      });
      return user;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch user');
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          username: true,
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          profilePicture: true,
        },
      });
      return user;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch user');
    }
  },

  createUser: async (userData: Omit<SignUpInput, 'confirmPassword'>) => {
    try {
      await prisma.user.create({
        data: userData,
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create user');
    }
  },

  createFacebookUser: async (userData: FacebookSignUpInput) => {
    try {
      await prisma.user.create({
        data: userData,
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create user with Facebook login');
    }
  },

  createGoogleUser: async (userData: GoogleSignUpInput) => {
    try {
      await prisma.user.create({
        data: userData,
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create user with Google login');
    }
  },

  updateUser: async (userData: UserUpdateInput, userId: number) => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: userData,
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update account information');
    }
  },

  addUserGeneratedPicture: async (
    picture: { imageUrl: string; publicId: string },
    prompt: string,
    userId: number,
  ) => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          generatedPictures: {
            create: {
              imageUrl: picture.imageUrl,
              publicId: picture.publicId,
              prompt,
            },
          },
          generationCount: { increment: 1 },
        },
      });

      return picture;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update account information');
    }
  },

  updateUserRoles: async (formData: { id: number; role: UserRole }[]) => {
    try {
      const updatePromises = [];

      for (const user of formData) {
        updatePromises.push(
          prisma.user.update({
            where: { id: user.id },
            data: { role: user.role },
          }),
        );
      }

      await Promise.all(updatePromises);
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update account information');
    }
  },
};

export default userServices;
