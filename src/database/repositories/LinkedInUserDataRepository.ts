import { type GetLinkedInUserData, GetLinkedInUserDataSchema, type LinkedInUserDataDetail } from '@/resources/user.resource';
import prisma from '../connection/data-source';

export const upsertLinkedInUserData = async (
  linkedInUserId: number,
  userData: LinkedInUserDataDetail
): Promise<void> => {
  await prisma.linkedInUserData.upsert({
    where: { linkedInUserId },
    update: { ...userData },
    create: { linkedInUserId, ...userData }
  });
};

export const getLinkedInUserData = async (linkedInUserId: number): Promise<GetLinkedInUserData | null> => {
  const userData = await prisma.linkedInUserData.findUnique({
    where: {
      linkedInUserId
    },
    omit: {
      createdAt: true,
      updatedAt: true
    }
  });

  if (!userData) {
    return;
  }

  return GetLinkedInUserDataSchema.parse(userData);
};
