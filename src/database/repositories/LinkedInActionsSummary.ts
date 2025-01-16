import prisma from '../connection/data-source';
import { type LinkedinActionSummaryBasic } from '@/resources/connection.resource';

const todayDate = (): Date => {
  const customDateOnly = new Date();
  customDateOnly.setHours(0, 0, 0, 0);

  return customDateOnly;
}

export const getLinkedInActionSummary = async (
  linkedInUserId: number,
  action: string,
  actionDate: Date = todayDate()
): Promise<LinkedinActionSummaryBasic | null> => {
  const actionSummary = await prisma.linkedInActionsSummary.findFirst({
    where: {
      linkedInUserId,
      action,
      actionDate
    },
    select: {
      id: true,
      linkedInUserId: true,
      action: true,
      actionDate: true,
      actionCount: true
    }
  });

  if (!actionSummary) {
    return null;
  }

  return {
    linkedInActionSummaryId: actionSummary.id,
    linkedInUserId: actionSummary.linkedInUserId,
    action: actionSummary.action,
    actionDate: actionSummary.actionDate,
    actionCount: actionSummary.actionCount
  }
};

export const createLinkedInActionSummary = async (
  linkedInUserId: number,
  actionCount: number,
  action: string,
  actionDate: Date = todayDate()
): Promise<void> => {
  await prisma.linkedInActionsSummary.create({
    data: {
      linkedInUserId,
      action,
      actionDate,
      actionCount
    }
  })
};

export const updateLinkedInActionSummary = async (
  linkedInActionsSummaryId: number,
  actionCount: number
): Promise<void> => {
  await prisma.linkedInActionsSummary.update({
    data: {
      actionCount: {
        increment: actionCount
      }
    },
    where: {
      id: linkedInActionsSummaryId
    }
  })
};
