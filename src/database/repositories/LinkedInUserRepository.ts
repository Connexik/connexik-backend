import moment from 'moment';
import { randomUUID } from 'node:crypto';

import { type BasicLinkedInUser, type GetLinkedInUser } from '@/resources/user.resource';
import prisma from '../connection/data-source';
import { type LinkedInUser } from '@prisma/client/default';

export const getOrCreateLinkedInUserInfo = async (
  authUserId: string,
  identifier: number,
  username: string,
  title: string,
  firstName: string,
  lastName: string
): Promise<GetLinkedInUser> => {
  let linkedInUser = await prisma.linkedInUser.findUnique({
    where: {
      identifier
    },
    select: {
      identifier: true,
      uuid: true,
      lastScannedAt: true
    }
  })

  if (!linkedInUser) {
    linkedInUser = await prisma.linkedInUser.create({
      data: {
        authUserId,
        identifier,
        username,
        firstName,
        lastName,
        title,
        uuid: randomUUID()
      },
      select: {
        uuid: true,
        identifier: true,
        lastScannedAt: true
      }
    });
  }
  return {
    identifier: linkedInUser.identifier,
    connexikId: linkedInUser.uuid,
    isLoggedIn: false,
    isScanned: !!linkedInUser.lastScannedAt,
    rescanTs: linkedInUser.lastScannedAt ? moment(linkedInUser.lastScannedAt).add(1, 'days').toISOString() : moment().toISOString()
  };
};

export const updateLinkedInUser = async (
  linkedInUserId: number,
  userData: Partial<LinkedInUser>
): Promise<void> => {
  await prisma.linkedInUser.update({
    where: { id: linkedInUserId },
    data: { ...userData }
  });
};

export const getLinkedInUserInfo = async (uuid: string): Promise<BasicLinkedInUser | null> => {
  return await prisma.linkedInUser.findUnique({
    where: {
      uuid
    },
    select: {
      id: true,
      username: true,
      identifier: true,
      uuid: true,
      lastScannedAt: true
    }
  });
}
