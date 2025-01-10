import moment from 'moment';
import { randomUUID, UUID } from 'node:crypto';

import { BasicLinkedInUser, GetLinkedInUser } from '@/resources/user.resource';
import prisma from '../connection/data-source';

export const getOrCreateLinkedInUserInfo = async (
  identifier: number, 
  username: string, 
  title: string, 
  firstName: string, 
  lastName: string
): Promise<GetLinkedInUser> => {
  let linkedInUser = await prisma.linkedInUser.findUnique({
    where: {
      identifier,
    },
    select: {
      identifier: true,
      uuid: true,
      lastScannedAt: true,
    }
  })

  if (!linkedInUser) {
    linkedInUser = await prisma.linkedInUser.create({
      data: {
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
    rescanTs: linkedInUser.lastScannedAt ? moment(linkedInUser.lastScannedAt).add(30, 'days').toISOString() : moment().toISOString(),
  };
};

export const getLinkedInUserInfo = async (uuid: string): Promise<BasicLinkedInUser | null> => {
  return await prisma.linkedInUser.findUnique({
    where: {
      uuid,
    },
    select: {
      id: true,
      username: true,
      identifier: true,
      uuid: true,
      lastScannedAt: true,
    }
  });
}