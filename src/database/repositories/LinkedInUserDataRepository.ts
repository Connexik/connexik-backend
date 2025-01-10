import { LinkedInUserDataDetail } from "@/resources/user.resource";
import prisma from "../connection/data-source";

export const upsertLinkedInUserData = async (
  linkedInUserId: number,
  userData: LinkedInUserDataDetail
): Promise<void> => {
  await prisma.linkedInUserData.upsert({
    where: { linkedInUserId },
    update: { ...userData },
    create: { linkedInUserId, ...userData },
  });
};
