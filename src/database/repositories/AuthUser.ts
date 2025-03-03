import type { ILinkedinAccessTokenResponse } from '@/resources/auth.resource';
import prisma from '../connection/data-source';

export const getAuthUserByUUID = async (id: string): Promise<{ authUserId: string, status: string }> => {
  const user = await prisma.authUser.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      status: true
    }
  });

  return user
    ? { authUserId: user?.id, status: user?.status }
    : null;
};

export const upsertAuthUser = async ({
  sub,
  email,
  emailVerified,
  firstName,
  lastName
}: ILinkedinAccessTokenResponse): Promise<{ authUserId: string, firstName: string, lastName: string, status: string }> => {
  const { id } = await prisma.authUser.upsert({
    where: { sub },
    update: { email, emailVerified, firstName, lastName },
    create: { sub, email, emailVerified, firstName, lastName, status: 'queued' },
    select: { id: true }
  });

  if (!id) {
    return null;
  }

  return { authUserId: id, firstName, lastName, status: 'queued' };
};
