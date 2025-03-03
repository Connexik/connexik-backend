import geminiUtils from '@/utils/gemini.utils';
import logUtils from '@/utils/log.utils';

import { getLinkedInUserInfo, getOrCreateLinkedInUserInfo, updateLinkedInUser } from '@/database/repositories/LinkedInUserRepository';
import { type BasicLinkedInUser, type GetLinkedInUser, type GetLinkedInUserData } from '@/resources/user.resource';
import { getLinkedInUserData, upsertLinkedInUserData } from '@/database/repositories/LinkedInUserDataRepository';

const logger = logUtils.processor('user.service.ts');

const getUserInfo = async (connexikId: string): Promise<BasicLinkedInUser | null> => {
  return await getLinkedInUserInfo(connexikId);
}

const getUserInfoData = async (linkedInUserId: number): Promise<GetLinkedInUserData | null> => {
  return await getLinkedInUserData(linkedInUserId);
}

const processConfig = async (authUserId: string, identifier: number, username: string, title: string, firstName: string, lastName: string): Promise<GetLinkedInUser> => {
  return await getOrCreateLinkedInUserInfo(authUserId, identifier, username, title, firstName, lastName);
};

const processScanner = async (linkedInUserId: number, text: string): Promise<void> => {
  const { data: userData, usageMetadata } = await geminiUtils.generateUserInfo(text);

  logger.info(usageMetadata, 'processScanner: usageMetadata');

  await Promise.all([
    upsertLinkedInUserData(linkedInUserId, userData),
    updateLinkedInUser(linkedInUserId, { lastScannedAt: new Date() })
  ])
};

export default {
  getUserInfo,
  getUserInfoData,
  processConfig,
  processScanner
}
