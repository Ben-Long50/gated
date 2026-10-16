import { Encounter, Notification } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: number;
      firstName?: string;
      lastName?: string;
      role?: string;
      profilePicture?: string;
      facebookId?: string;
      googleId?: string;
      receivedNotifications?: Notification[];
      generationCount?: number;
      _count?: { generatedPictures: number };
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      token?: string;
      encounter?: Encounter;
    }
  }
}
