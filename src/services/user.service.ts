import geminiUtils from "@/utils/gemini.utils";
import logUtils from "@/utils/log.utils";

import { getLinkedInUserInfo, getOrCreateLinkedInUserInfo } from "@/database/repositories/LinkedInUserRepository";
import { BasicLinkedInUser, GetLinkedInUser } from "@/resources/user.resource";
import { upsertLinkedInUserData } from "@/database/repositories/LinkedInUserDataRepository";

const logger = logUtils.processor('user.service.ts');

const getUserData = async (convexikId: string): Promise<BasicLinkedInUser | null> => {
    return await getLinkedInUserInfo(convexikId);
}

const processConfig = async (identifier: number, username: string, title: string, firstName: string, lastName: string): Promise<GetLinkedInUser> => {
    return await getOrCreateLinkedInUserInfo(identifier, username, title, firstName, lastName);
};

const processScanner = async (linkedInUserId: number, text: string) => {
    const {data: userData, usageMetadata} = await geminiUtils.generate(text);

    logger.info(usageMetadata, 'processScanner: usageMetadata');

    await upsertLinkedInUserData(linkedInUserId, userData);
};

export default {
    getUserData,
    processConfig,
    processScanner
}