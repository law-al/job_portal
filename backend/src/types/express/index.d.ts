// src/types/express/index.d.ts
// src/types/express/index.d.ts
import type { Prisma } from '../../generated/prisma/client.ts';
import type { UserModel as User } from '../../generated/prisma/models/User.ts';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
